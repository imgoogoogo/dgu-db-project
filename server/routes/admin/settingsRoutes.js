// server/routes/admin/settingsRoutes.js
import express from "express";
import {
  getAdmins,
  createAdmin,
  editAdmin,
  deleteAdmin,
  createBackup,
  restoreBackup,
} from "../../controllers/admin/settingsController.js";

const router = express.Router();

// 관리자 계정 조회
router.get("/admins", getAdmins);

// 관리자 계정 생성
router.post("/admin-create", createAdmin);

// 관리자 계정 수정
router.post("/admin-edit", editAdmin);

// 관리자 계정 삭제
router.post("/admin-delete", deleteAdmin);

// 백업 파일 생성
router.get("/backup", createBackup);

// 백업 복원
router.post("/restore", restoreBackup);

export default router;
