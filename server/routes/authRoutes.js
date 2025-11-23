// server/routes/authRoutes.js
import express from "express";
import { kakaoLogin, kakaoCallback, kakaoLogout} from "../controllers/authController.js";


const router = express.Router();

router.get("/kakao/login", kakaoLogin);
router.get("/kakao/callback", kakaoCallback);
router.get("/kakao/logout", kakaoLogout);

export default router;
