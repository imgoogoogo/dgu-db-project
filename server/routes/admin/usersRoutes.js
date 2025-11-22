import express from "express";
import {
  getUsers,
  giveItem,
  giveGold,
  banUser
} from "../../controllers/admin/usersController.js";

const router = express.Router();

// 유저 목록 조회 + 검색
router.get("/", getUsers);

// 아이템 지급
router.post("/give-item", giveItem);

// 골드 지급
router.post("/give-gold", giveGold);

// 유저 제재
router.post("/ban", banUser);

export default router;
