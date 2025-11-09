// index.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// ────────────────────────────────
// 1. 현재 경로 계산 (ESM에서 __dirname 대체)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ────────────────────────────────
// 2. Express 앱 생성
const app = express();
const PORT = 3000;

// ────────────────────────────────
// 3. 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 바디 파싱
app.use(express.static(path.join(__dirname, "client"))); // 정적 파일 제공

// ────────────────────────────────
// 4. API 라우터 불러오기 (분리형 구조)
import playerRoutes from "./server/api/player.js";
import rankRoutes from "./server/api/rank.js";
import inventoryRoutes from "./server/api/inventory.js";
import auctionRoutes from "./server/api/auction.js";

// ────────────────────────────────
// 5. 라우터 등록
app.use("/api/player", playerRoutes);
app.use("/api/rank", rankRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auction", auctionRoutes);

// ────────────────────────────────
// 6. 루트 라우트 — 기본 index.html 반환
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
  console.log("✅ Root route accessed, index.html served.");
});

// ────────────────────────────────
// 7. 테스트용 기본 API
app.get("/api/hello", (req, res) => {
  res.json({ message: "서버 정상 작동 중 ✅" });
});

// ────────────────────────────────
// 8. 서버 실행
app.listen(PORT, () => {
  console.log(`🧩 ZombieSurvival server running on: http://localhost:${PORT}`);
});
