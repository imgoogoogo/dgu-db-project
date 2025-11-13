// server/routes/rankRoutes.js
import express from "express";
import { getRanking } from "../controllers/rankController.js";

const router = express.Router();

router.get("/", getRanking);

export default router;
