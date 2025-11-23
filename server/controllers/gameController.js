// server/controllers/gameController.js
import pool from "../config/db.js";

/* ===========================================================
   1) GET /api/game
=========================================================== */
export const getGameData = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 1) 캐릭터 기본 정보
    const [[charInfo]] = await pool.query(
      `SELECT name, hp, atk, def FROM characters WHERE char_id = ?`,
      [charId]
    );
    if (!charInfo)
      return res.status(404).json({ success: false, message: "캐릭터 없음" });

    // 2) 착용 아이템 스탯
    const [equippedItems] = await pool.query(
      `SELECT it.add_hp, it.add_atk, it.add_def
       FROM inventory inv
       JOIN items it ON inv.item_id = it.item_id
       WHERE inv.char_id = ? AND inv.equipped = 1`,
      [charId]
    );

    let bonusHp = 0,
      bonusAtk = 0,
      bonusDef = 0;

    equippedItems.forEach((it) => {
      bonusHp += it.add_hp;
      bonusAtk += it.add_atk;
      bonusDef += it.add_def;
    });

    const finalChar = {
      name: charInfo.name,
      totalHp: charInfo.hp + bonusHp,
      totalAtk: charInfo.atk + bonusAtk,
      totalDef: charInfo.def + bonusDef,
    };

    // 3) 몬스터 목록 (DB 구조에 맞게 chance, drop_item_id 제거)
    const [monsters] = await pool.query(
      `SELECT 
          monster_id AS id,
          name,
          hp,
          atk,
          def,
          speed
       FROM monsters
       ORDER BY monster_id ASC`
    );

    // 4) 아이템 목록 (chance 제거)
    const [items] = await pool.query(
      `SELECT
          item_id AS id,
          name,
          type,
          add_hp,
          add_atk,
          add_def,
          description
       FROM items
       ORDER BY item_id ASC`
    );

    const [drops] = await pool.query(
      `SELECT
        monster_id,
        item_id,
        chance
        FROM monsters_drops
        ORDER BY monster_id DESC`
    );

    // ⭐ 게임 시작 로그
    await pool.query(
      `INSERT INTO user_logs (char_id, type, action)
       VALUES (?, 'action', '게임 시작')`,
      [charId]
    );

    return res.json({
      success: true,
      charInfo: finalChar,
      monsters,
      items,
      drops
    });
  } catch (err) {
    console.error("getGameData error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================================================
   1-1) GET /api/game/config
=========================================================== */
export async function getGameConfig(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT category, config_key, config_value FROM game_config"
    );

    const config = { stage: {}, level: {} };

    for (const row of rows) {
      let value = row.config_value;
      if (!isNaN(value)) value = Number(value);
      config[row.category][row.config_key] = value;
    }

    return res.json({ success: true, config });
  } catch (err) {
    console.error("getGameConfig error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ===========================================================
   2) POST /api/game/end
=========================================================== */
export const endGame = async (req, res) => {
  try {
    const charId = req.user.char_id;

    const {
      stage,
      survivalTime, // "00:18"
      goldEarned,
      rewards,
    } = req.body;

    const gold = goldEarned ?? 0;

    // ⭐ 캐릭터 기록 업데이트 (DB 컬럼명에 맞춤)
    await pool.query(
      `UPDATE characters 
       SET 
         best_stage = GREATEST(best_stage, ?),
         best_survived_time = ?, 
         gold = gold + ?,
         best_played_date = NOW()
       WHERE char_id = ?`,
      [stage, survivalTime, gold, charId]
    );

    // ⭐ 아이템 보상 등록
    if (Array.isArray(rewards)) {
      for (const itemId of rewards) {
        await pool.query(
          `INSERT INTO inventory (char_id, item_id, equipped, auctioned)
           VALUES (?, ?, 0, 0)`,
          [charId, itemId]
        );
      }
    }

    // ⭐ 게임 종료 로그 기록
    await pool.query(
      `INSERT INTO user_logs (char_id, type, action, detail)
       VALUES (?, 'action', '게임 종료', ?)`,
      [
        charId,
        `stage:${stage}, time:${survivalTime}, gold:${gold}`,
      ]
    );

    return res.json({ success: true, message: "게임 결과 저장 완료" });
  } catch (err) {
    console.error("endGame error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
