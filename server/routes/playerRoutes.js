import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { registerPlayer, updateStats } from "../controllers/playerController.js";

const router = express.Router();

// 신규 캐릭터 생성
router.post("/register", verifyToken, registerPlayer);

// 스탯 강화
router.patch("/update/stats", verifyToken, updateStats);

export default router;
