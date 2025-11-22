// server/routes/admin/logsRoutes.js
import express from "express";
import {
  getLoginLogs,
  getUserLogs,
  getAdminLogs
} from "../../controllers/admin/logsController.js";

const router = express.Router();

// 로그인 로그 (최근 30개)
router.get("/login", getLoginLogs);

// 유저 행동 로그 (최근 30개)
router.get("/user", getUserLogs);

// 관리자 활동 로그 (최근 30개)
router.get("/admin", getAdminLogs);

export default router;
