// server/api/rank.js
// ──────────────────────────────────────────────────────────────
// "랭킹" 관련 REST API
// - /api/rank/global       : 전체 랭킹(최고 스테이지 > 전투력 순)
// - /api/rank/stage/:stage : 특정 스테이지 달성 유저들 (예: 스테이지 클리어 랭킹)
// ──────────────────────────────────────────────────────────────
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * [GET] /api/rank/global
 * - characters 테이블 기준으로 상위 랭킹 출력
 * - 정렬: max_stage DESC → (atk+def+hp) DESC
 * - 필요한 칼럼은 프로젝트 상황에 맞게 조정 가능
 */
router.get("/global", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.char_id,
        c.name            AS nickname,
        c.max_stage,
        c.gold,
        (c.atk + c.def + c.hp) AS power
      FROM characters c
      ORDER BY c.max_stage DESC, power DESC
      LIMIT 20
    `);

    return res.json({
      success: true,
      message: "전체 랭킹 조회 완료",
      data: rows,
    });
  } catch (err) {
    console.error("❌ /rank/global error:", err);
    return res.status(500).json({ success: false, message: "랭킹 조회 실패" });
  }
});

/**
 * [GET] /api/rank/stage/:stage
 * - 특정 스테이지에 도달한 캐릭터들을 골드/전투력 등으로 정렬
 * - 여기서는 예시로 power 기준(=atk+def+hp) 내림차순
 */
router.get("/stage/:stage", async (req, res) => {
  const { stage } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        c.char_id,
        c.name          AS nickname,
        c.max_stage,
        c.gold,
        (c.atk + c.def + c.hp) AS power
      FROM characters c
      WHERE c.max_stage = ?
      ORDER BY power DESC, c.gold DESC
      LIMIT 50
      `,
      [stage]
    );

    return res.json({
      success: true,
      message: `스테이지 ${stage} 랭킹 조회 완료`,
      data: rows,
    });
  } catch (err) {
    console.error("❌ /rank/stage error:", err);
    return res.status(500).json({ success: false, message: "스테이지 랭킹 조회 실패" });
  }
});

export default router;
