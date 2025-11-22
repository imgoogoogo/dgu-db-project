// server/routes/admin/balanceRoutes.js
import express from "express";
import {
  getItemBalance,
  saveItemBalance,
  getMonsterBalance,
  saveMonsterBalance,
  getStageBalance,
  saveStageBalance
} from "../../controllers/admin/balanceController.js";

const router = express.Router();

// 📌 아이템 밸런스
router.get("/items", getItemBalance);
router.post("/items/save", saveItemBalance);

// 📌 몬스터 밸런스
router.get("/monsters", getMonsterBalance);
router.post("/monsters/save", saveMonsterBalance);

// 📌 스테이지 밸런스
router.get("/stages", getStageBalance);
router.post("/stages/save", saveStageBalance);

export default router;
