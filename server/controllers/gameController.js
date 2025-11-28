// server/controllers/gameController.js
import { json } from "express";
import pool from "../config/db.js";
import { verifyCharacter } from "./utils/SecurityService.js";

/* ===========================================================
   1) GET /api/game
=========================================================== */
export const getGameData = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 1) 캐릭터 기본 정보
    const [[charInfo]] = await pool.query(
      `SELECT
        CAST(c.hp + IFNULL(ces.bonusHp, 0) AS UNSIGNED) AS totalHp,
        CAST(c.atk + IFNULL(ces.bonusAtk, 0) AS UNSIGNED) AS totalAtk,
        CAST(c.def + IFNULL(ces.bonusDef, 0) AS UNSIGNED) AS totalDef
      FROM characters c
      JOIN v_character_equipped_stats ces 
      ON ces.char_id = c.char_id
      WHERE c.char_id = ?`,
      [charId]
    );
    if (!charInfo)
      return res.status(404).json({ success: false, message: "캐릭터 없음" });

    // 3) 몬스터 목록 (DB 구조에 맞게 chance, drop_item_id 제거)
    const [monsters] = await pool.query(
      `SELECT 
          monster_id AS id,
          name,
          hp,
          atk,
          def,
          speed,
          chance
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

    // 5) 몬스터 드롭 아이템 목록
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
      charInfo: charInfo,
      monsters,
      items,
      drops,
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
    const userId = req.user.account_id;
    const charId = req.user.char_id;
    const { stage, survivalTime, goldEarned, kills, rewards } = req.body;
    const gold = goldEarned ?? 0;

    const isValidCharacter = await verifyCharacter(userId, charId);
    if (!isValidCharacter) {
      return res
        .status(403)
        .json({ success: false, message: "캐릭터 검증에 실패함." });
    }

    await pool.query(`CALL sp_save_game(?, ?, ?, ?, ?, ?)`, [
      charId,
      stage,
      kills,
      survivalTime,
      gold,
      JSON.stringify(rewards || []),
    ]);

    // 게임 종료 로그 기록
    await pool.query(
      `INSERT INTO user_logs (char_id, type, action, detail)
       VALUES (?, 'action', '게임 종료', ?)`,
      [charId, `stage:${stage}, time:${survivalTime}, gold:${gold}`]
    );

    return res.json({ success: true, message: "게임 결과 저장 완료" });
  } catch (err) {
    console.error("endGame error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
