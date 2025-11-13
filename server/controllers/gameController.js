// server/controllers/gameController.js
import pool from "../config/db.js";

// POST /api/game/end
// body: { stage, killCount, playTime, items: [{itemId, qty}], goldEarned }
export const endGame = async (req, res) => {
  const charId = req.user.char_id;
  const { stage, killCount, playTime, items = [], goldEarned = 0 } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 골드, 최고 스테이지 업데이트
    await conn.query(
      "UPDATE characters SET gold = gold + ?, max_stage = GREATEST(max_stage, ?) WHERE char_id = ?",
      [goldEarned, stage, charId]
    );

    // 2) 아이템 지급
    for (const item of items) {
      const qty = item.qty ?? item.quantity ?? 1;
      await conn.query(
        `INSERT INTO inventory (char_id, item_id, quantity, equipped, auctioned)
         VALUES (?, ?, ?, 0, 0)
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        [charId, item.itemId, qty]
      );
    }

    // 3) 게임 로그 기록
    await conn.query(
      `INSERT INTO game_log (char_id, stage, kill_count, play_time, gold_earned)
       VALUES (?, ?, ?, ?, ?)`,
      [charId, stage, killCount, playTime, goldEarned]
    );

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("endGame error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
