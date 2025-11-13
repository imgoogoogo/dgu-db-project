// server/controllers/rankController.js
import pool from "../config/db.js";

// GET /api/ranking
export const getRanking = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT char_id, name AS nickname, max_stage, gold
         FROM characters
        ORDER BY max_stage DESC, gold DESC
        LIMIT 100`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getRanking error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
