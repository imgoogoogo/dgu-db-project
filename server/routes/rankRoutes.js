// server/routes/rankRoutes.js
import express from "express";
import { getRanking } from "../controllers/rankController.js";
import { verifyToken } from "../middlewares/auth.js";


const router = express.Router();

router.get("/", verifyToken ,getRanking);

export default router;
