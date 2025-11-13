// server/routes/auctionRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  listAuction,
  sellAuction,
  buyAuction,
  cancelAuction,
} from "../controllers/auctionController.js";

const router = express.Router();

router.get("/", listAuction);                          // 조회는 공개
router.post("/sell", verifyToken, sellAuction);        // 판매: JWT 필요
router.post("/buy", verifyToken, buyAuction);          // 구매: JWT 필요
router.delete("/cancel/:auctionId", verifyToken, cancelAuction); // 취소: JWT

export default router;
