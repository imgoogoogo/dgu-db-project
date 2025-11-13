// server/routes/gameRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { endGame } from "../controllers/gameController.js";

const router = express.Router();

// 게임 결과 저장
router.post("/end", verifyToken, endGame);

export default router;
