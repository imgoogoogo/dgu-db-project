// server/routes/auctionRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

import {
  listAuction,
  buyAuction,
  cancelAuction,
} from "../controllers/auctionController.js";

const router = express.Router();

// ⭐ 경매 목록 조회
router.get("/", verifyToken, listAuction);

// ⭐ 경매 구매
router.post("/buy", verifyToken, buyAuction);

// ⭐ 경매 취소
router.delete("/cancel", verifyToken, cancelAuction);


export default router;
