// server/routes/inventoryRoutes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", getInventory);
// router.get("/", verifyToken, getInventory);

export default router;
