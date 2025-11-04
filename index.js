// index.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 현재 경로 계산 (ESM에서 __dirname 대체용
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express 앱 생성
const app = express();
const PORT = 3000;
// 정적 파일 제공 (public 폴더에 HTML, JS, 이미지 넣기)
app.use(express.static(path.join(__dirname, "client")));

// 루트 라우트 — 기본 index.html 반환
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
  console.log("✅ Root route accessed, index.html served.");
});

// 예시 API 라우트 (테스트용)
app.get("/api/hello", (req, res) => {
  res.json({ message: "서버 정상 작동 중 ✅" });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ ZombieSurvival server running on: http://localhost:${PORT}`);
});
