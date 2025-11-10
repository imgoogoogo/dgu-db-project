// ✅ db.js — MariaDB 연결 설정
// -------------------------------------------
// 이 파일은 Express 서버에서 MariaDB에 연결할 때 사용됩니다.
// mysql2/promise 모듈을 사용해서 비동기/await 방식으로 쿼리를 실행할 수 있습니다.
// -------------------------------------------

import mysql from "mysql2/promise";

// ✅ 데이터베이스 연결 풀(Pool) 생성
// export const pool = mysql.createPool({...});
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "rpg_game",
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 연결 테스트
try {
  const connection = await pool.getConnection();
  console.log("✅ MariaDB 연결 성공 (rpg_game)");
  connection.release();
} catch (err) {
  console.error("❌ MariaDB 연결 실패:", err.message);
}

export default pool;  // ✅ 기본(default) 내보내기로 변경
