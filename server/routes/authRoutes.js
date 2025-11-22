// server/routes/authRoutes.js
import express from "express";
import { kakaoLogin, kakaoCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/kakao/login", kakaoLogin);
router.get("/kakao/callback", kakaoCallback);

export default router;
