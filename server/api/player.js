// server/api/player.js
// ──────────────────────────────────────────────────────────────
// "플레이어" 관련 REST API
// - /api/player/register  : 계정 생성(필수: login_id, password)
// - /api/player/saveResult: 게임 결과 저장(캐릭터 스탯/최고 스테이지 업데이트)
// ──────────────────────────────────────────────────────────────
import express from "express";
import pool  from "../config/db.js";

const router = express.Router();

// 🧩 플레이어 등록
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO accounts (username, password, created_at) VALUES (?, ?, NOW())",
      [username, password]
    );
    res.json({ success: true, message: "플레이어 등록 완료", user_id: result.insertId });
  } catch (err) {
    console.error("❌ 등록 실패:", err.message);
    res.json({ success: false, message: err.message });
  }
});

// 🧩 플레이어 목록 확인 (테스트용)
router.get("/list", async (req, res) => {
  const [rows] = await pool.query("SELECT user_id, username, email FROM accounts");
  res.json({ success: true, data: rows });
});

export default router;

