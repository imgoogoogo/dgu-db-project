// index.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ----------------------
// 공통 미들웨어
// ----------------------
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 (리액트 빌드)
app.use(express.static(path.join(__dirname, "client")));

// ----------------------
// 기존 게임 API 라우트
// ----------------------
import authRoutes from "./server/routes/authRoutes.js";
import playerRoutes from "./server/routes/playerRoutes.js";
import inventoryRoutes from "./server/routes/inventoryRoutes.js";
import rankRoutes from "./server/routes/rankRoutes.js";
import auctionRoutes from "./server/routes/auctionRoutes.js";
import gameRoutes from "./server/routes/gameRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/ranking", rankRoutes);
app.use("/api/auction", auctionRoutes);
app.use("/api/game", gameRoutes);

// ----------------------
// 🔥 Admin 라우트 추가
// ----------------------
import dashboardRoutes from "./server/routes/admin/dashboardRoutes.js";
import usersRoutes from "./server/routes/admin/usersRoutes.js";
import balanceRoutes from "./server/routes/admin/balanceRoutes.js";
import logsRoutes from "./server/routes/admin/logsRoutes.js";
import settingsRoutes from "./server/routes/admin/settingsRoutes.js";

app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/balance", balanceRoutes);
app.use("/api/admin/logs", logsRoutes);
app.use("/api/admin/settings", settingsRoutes);

// ----------------------
// 기본 페이지
// ----------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// 상태 체크
app.get("/api/hello", (req, res) => {
  res.json({ message: "서버 정상 작동 중 ✅" });
});

// 404
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: "요청한 API를 찾을 수 없습니다." });
});

app.listen(PORT, () => {
  console.log(
    `🔥 ZombieSurvival API Server Running → http://192.168.0.23:${PORT}`
  );
});
