// server/config/db.js
// ──────────────────────────────────────────────────────────────
// MariaDB 연결 풀 생성 파일 (mysql2/promise 사용)
// - 모든 라우터에서 이 pool을 import 해서 사용
// - 쿼리는 반드시 "?" 바인딩(Prepared Statement)으로 보안/성능 확보
// ──────────────────────────────────────────────────────────────
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",   // ← 실제 비밀번호로 교체하세요. 나중엔 .env로 분리 추천
  database: "rpg_game",  // ← 네가 만든 DB명
  connectionLimit: 10,   // 동시 커넥션 제한 (필요 시 조정)
  // timezone: "Z",      // 필요하면 타임존 지정 (예: UTC)
});

export default pool;
