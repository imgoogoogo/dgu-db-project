// index.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// ESM용 __dirname 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express 서버 생성
const app = express();
const PORT = 3000;

// ----------------------------------------------
// 📌 공통 미들웨어
// ----------------------------------------------
app.use(cors( { origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 📌 정적 파일 (client 폴더)
app.use(express.static(path.join(__dirname, "client")));


// ----------------------------------------------
// 📌 라우터 불러오기
// ----------------------------------------------
import authRoutes from "./server/routes/authRoutes.js";
import playerRoutes from "./server/routes/playerRoutes.js";
import inventoryRoutes from "./server/routes/inventoryRoutes.js";
import rankRoutes from "./server/routes/rankRoutes.js";
import auctionRoutes from "./server/routes/auctionRoutes.js";
import gameRoutes from "./server/routes/gameRoutes.js";


// ----------------------------------------------
// 📌 라우터 등록
// ----------------------------------------------
app.use("/api/auth", authRoutes);        // 로그인/로그아웃
app.use("/api/player", playerRoutes);      // 캐릭터 등록/스탯 강화
app.use("/api/inventory", inventoryRoutes);// 인벤토리 조회
app.use("/api/ranking", rankRoutes);       // 랭킹 조회
app.use("/api/auction", auctionRoutes);    // 경매 (판매/구매/취소)
app.use("/api/game", gameRoutes);          // 게임 종료 보상 저장


// ----------------------------------------------
// 📌 기본 라우팅 (client/index.html 반환)
// ----------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ----------------------------------------------
// 📌 서버 상태 체크용 API
// ----------------------------------------------
app.get("/api/hello", (req, res) => {
  res.json({ message: "서버 정상 작동 중 ✅" });
});

// ----------------------------------------------
// 📌 404 처리 (선택)
// ----------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "요청한 API를 찾을 수 없습니다." });
});

// ----------------------------------------------
// 📌 서버 실행
// ----------------------------------------------
app.listen(PORT, () => {
  console.log(`🔥 ZombieSurvival API Server Running → http://localhost:${PORT}`);
});
