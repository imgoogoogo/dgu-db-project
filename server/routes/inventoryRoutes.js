// server/routes/inventoryRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

import {
  getInventory,
  enhanceStats,
  equipItem,
  unequipItem,
  sellItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

// 인벤토리 조회
router.get("/", verifyToken, getInventory);

// 능력치 강화 버튼
router.post("/enforce", verifyToken, enhanceStats);

// 아이템 장착
router.post("/equip", verifyToken, equipItem);

// 아이템 장착 해제
router.post("/unequip", verifyToken, unequipItem);

// 아이템 판매
router.post("/sell", verifyToken, sellItem);

export default router;
