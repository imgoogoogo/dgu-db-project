// server/controllers/gameController.js
import pool from "../config/db.js";

/* ===========================================================
   1) GET /api/game
   게임 시작 시 캐릭터 스탯, 몬스터 목록, 아이템 목록 반환
=========================================================== */
export const getGameData = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 1) 캐릭터 정보
    const [[charInfo]] = await pool.query(
      `SELECT name, hp, atk, def FROM characters WHERE char_id = ?`,
      [charId]
    );
    if (!charInfo)
      return res.status(404).json({ success: false, message: "캐릭터 없음" });

    // 2) 착용 아이템 스탯
    const [equippedItems] = await pool.query(
      `SELECT add_hp, add_atk, add_def 
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

    // 캐릭터 최종 스탯
    const finalChar = {
      name: charInfo.name,
      totalHp: charInfo.hp + bonusHp,
      totalAtk: charInfo.atk + bonusAtk,
      totalDef: charInfo.def + bonusDef,
    };

    // 3) 몬스터 목록
    const [monsters] = await pool.query(
      `SELECT 
          monster_id AS id,
          name,
          level,
          hp,
          atk,
          def,
          chance
        FROM monsters
        ORDER BY monster_id ASC`
    );

    // 4) 아이템 목록
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

    return res.json({
      success: true,
      charInfo: finalChar,
      monsters,
      items,
    });
  } catch (err) {
    console.error("getGameData error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ===========================================================
   2) POST /api/game/end
   게임 종료 후 보상(골드, 아이템) 저장하는 API
=========================================================== */
export const endGame = async (req, res) => {
  try {
    const charId = req.user.char_id;
    const { gold, items } = req.body;

    // ⭐ 캐릭터 골드 추가
    await pool.query(
      `UPDATE characters SET gold = gold + ? WHERE char_id = ?`,
      [gold ?? 0, charId]
    );

    // ⭐ 아이템 보상 있으면 inventory에 추가
    if (Array.isArray(items)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO inventory (char_id, item_id, quantity, equipped, auctioned)
           VALUES (?, ?, ?, 0, 0)
           ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
          [charId, item.itemId, item.quantity ?? 1]
        );
      }
    }

    return res.json({ success: true, message: "게임 결과 저장 완료" });
  } catch (err) {
    console.error("endGame error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
