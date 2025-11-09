// server/api/player.js
// ──────────────────────────────────────────────────────────────
// "플레이어" 관련 REST API
// - /api/player/register  : 계정 생성(필수: login_id, password)
// - /api/player/saveResult: 게임 결과 저장(캐릭터 스탯/최고 스테이지 업데이트)
// ──────────────────────────────────────────────────────────────
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * [POST] /api/player/register
 * - accounts 테이블에 새 계정 생성
 * - 성공 시 생성된 account_id 반환
 * body: { login_id: string, password: string }
 */
router.post("/register", async (req, res) => {
  const { login_id, password } = req.body;

  // 1) 입력 유효성 체크 (간단 버전)
  if (!login_id || !password) {
    return res.status(400).json({
      success: false,
      message: "login_id와 password는 필수입니다.",
    });
  }

  try {
    // 2) 중복 계정 방지 (login_id UNIQUE 제약을 권장)
    const [dup] = await pool.query(
      "SELECT account_id FROM accounts WHERE login_id = ?",
      [login_id]
    );
    if (dup.length > 0) {
      return res.status(409).json({
        success: false,
        message: "이미 존재하는 login_id 입니다.",
      });
    }

    // 3) 신규 계정 생성
    const [result] = await pool.query(
      `INSERT INTO accounts (login_id, password, create_date)
       VALUES (?, ?, NOW())`,
      [login_id, password]
    );

    return res.json({
      success: true,
      message: "계정 등록 완료",
      data: { account_id: result.insertId },
    });
  } catch (err) {
    console.error("❌ /player/register error:", err);
    return res.status(500).json({ success: false, message: "등록 실패" });
  }
});

/**
 * [POST] /api/player/saveResult
 * - 캐릭터의 최신 결과(스탯, 골드, 최고 스테이지)를 저장
 * - 점수 이력 테이블을 따로 둘 예정이면 INSERT를 추가하면 됨
 * body: { char_id, hp, atk, def, gold, max_stage }
 */
router.post("/saveResult", async (req, res) => {
  const { char_id, hp, atk, def, gold, max_stage } = req.body;

  // 1) 입력 검증
  if (!char_id) {
    return res.status(400).json({
      success: false,
      message: "char_id는 필수입니다.",
    });
  }

  try {
    // 2) 캐릭터 존재 여부 확인
    const [ch] = await pool.query(
      "SELECT char_id FROM characters WHERE char_id = ?",
      [char_id]
    );
    if (ch.length === 0) {
      return res.status(404).json({
        success: false,
        message: "해당 캐릭터가 존재하지 않습니다.",
      });
    }

    // 3) 캐릭터 스탯 업데이트
    await pool.query(
      `UPDATE characters
         SET hp = COALESCE(?, hp),
             atk = COALESCE(?, atk),
             def = COALESCE(?, def),
             gold = COALESCE(?, gold),
             max_stage = GREATEST(COALESCE(?, max_stage), max_stage), -- 최고 스테이지만 갱신
             last_updated = NOW()
       WHERE char_id = ?`,
      [hp, atk, def, gold, max_stage, char_id]
    );

    return res.json({
      success: true,
      message: "결과 저장 완료",
    });
  } catch (err) {
    console.error("❌ /player/saveResult error:", err);
    return res.status(500).json({ success: false, message: "결과 저장 실패" });
  }
});

export default router;
