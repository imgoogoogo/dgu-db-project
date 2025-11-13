// server/config/db.js
import mysql from "mysql2/promise";

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

try {
  const conn = await pool.getConnection();
  console.log("✅ MariaDB 연결 성공 (rpg_game)");
  conn.release();
} catch (err) {
  console.error("❌ MariaDB 연결 실패:", err.message);
}

export default pool;
