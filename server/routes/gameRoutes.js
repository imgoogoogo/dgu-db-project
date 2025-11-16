// server/routes/gameRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getGameData, endGame } from "../controllers/gameController.js";

const router = express.Router();

// 게임 데이터 로드
router.get("/", verifyToken, getGameData);

// 게임 종료 후 결과 저장
router.post("/end", verifyToken, endGame);

export default router;
