import express from "express";
import {
  getDashboardSummary,
  getSignupStats,
  getStageStats,
  getRecentLogins
} from "../../controllers/admin/dashboardController.js";

const router = express.Router();

// 대시보드 요약 정보
router.get("/summary", getDashboardSummary);

// 신규 가입자 그래프
router.get("/signup-stats", getSignupStats);

// 스테이지 분포 그래프
router.get("/stage-stats", getStageStats);

// 최근 로그인 기록
router.get("/recent-logins", getRecentLogins);

export default router;
