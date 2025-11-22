import pool from "../../config/db.js";
import moment from "moment";
import "moment/locale/ko.js";
moment.locale("ko");

/* ============================================================
   1) 대시보드 요약 정보
============================================================ */
export const getDashboardSummary = async (req, res) => {
  try {
    const [[today]] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM accounts
      WHERE DATE(created_at) = CURDATE()
    `);

    const [[yesterday]] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM accounts
      WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    `);

    const [[total]] = await pool.query(`
      SELECT COUNT(*) AS count
      FROM accounts
    `);

    const compare = today.count - yesterday.count;

    res.json({
      todaySignup: today.count,
      yesterdayCompare: compare,
      totalUsers: total.count
    });

  } catch (err) {
    console.error("getDashboardSummary error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   2) 신규 가입자 그래프
============================================================ */
export const getSignupStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        DAYOFWEEK(MAX(created_at)) AS weekday,
        COUNT(*) AS count
      FROM accounts
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const weekMap = ["일", "월", "화", "수", "목", "금", "토"];

    const labels = [];
    const values = [];

    rows.forEach(r => {
      labels.push(weekMap[r.weekday - 1]);
      values.push(r.count);
    });

    res.json({ labels, values });

  } catch (err) {
    console.error("getSignupStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   3) 스테이지 분포 그래프
============================================================ */
export const getStageStats = async (req, res) => {
  try {
    const [[s1]] = await pool.query(`
      SELECT COUNT(*) AS count FROM characters WHERE max_stage BETWEEN 1 AND 10
    `);
    const [[s2]] = await pool.query(`
      SELECT COUNT(*) AS count FROM characters WHERE max_stage BETWEEN 11 AND 20
    `);
    const [[s3]] = await pool.query(`
      SELECT COUNT(*) AS count FROM characters WHERE max_stage BETWEEN 21 AND 30
    `);
    const [[s4]] = await pool.query(`
      SELECT COUNT(*) AS count FROM characters WHERE max_stage BETWEEN 31 AND 40
    `);
    const [[s5]] = await pool.query(`
      SELECT COUNT(*) AS count FROM characters WHERE max_stage >= 41
    `);

    res.json({
      labels: [
        "Stage 1-10",
        "Stage 11-20",
        "Stage 21-30",
        "Stage 31-40",
        "Stage 41+"
      ],
      values: [s1.count, s2.count, s3.count, s4.count, s5.count]
    });

  } catch (err) {
    console.error("getStageStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   4) 최근 로그인 기록
============================================================ */
export const getRecentLogins = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        name AS username, 
        created_at
      FROM user_logs
      WHERE type = 'login'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const logins = rows.map(r => ({
      username: r.username,
      time: moment(r.time).fromNow()
    }));

    res.json({ logins });

  } catch (err) {
    console.error("getRecentLogins error:", err);
    res.status(500).json({ message: err.message });
  }
};
