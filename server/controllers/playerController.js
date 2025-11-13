// server/controllers/playerController.js
import pool from "../config/db.js";

// [1] 플레이어 등록
export const registerPlayer = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "캐릭터 이름(name)이 필요합니다." });
    }

    const [dup] = await pool.query("SELECT char_id FROM characters WHERE name = ?", [name]);
    if (dup.length > 0) {
      return res.status(400).json({ success: false, message: "이미 존재하는 이름입니다." });
    }

    const [result] = await pool.query(
      `INSERT INTO characters (account_id, name, hp, atk, def, gold, max_stage)
       VALUES (?, ?, 100, 10, 5, 0, 1)`,
      [accountId, name]
    );

    res.json({ success: true, message: "플레이어 등록 완료", data: { playerId: result.insertId, name } });
  } catch (err) {
    console.error("registerPlayer error:", err);
    res.status(500).json({ success: false, message: "플레이어 등록 실패" });
  }
};


// [2] 스탯 강화
export const updateStats = async (req, res) => {
  try {
    const charId = req.user.char_id;
    const { hp, atk, def } = req.body;

    const fields = [];
    const params = [];

    if (hp != null) { fields.push("hp = ?"); params.push(hp); }
    if (atk != null) { fields.push("atk = ?"); params.push(atk); }
    if (def != null) { fields.push("def = ?"); params.push(def); }

    if (fields.length === 0) return res.json({ success: true });

    params.push(charId);
    const sql = `UPDATE characters SET ${fields.join(", ")} WHERE char_id = ?`;
    await pool.query(sql, params);

    res.json({ success: true });
  } catch (err) {
    console.error("updateStats error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
