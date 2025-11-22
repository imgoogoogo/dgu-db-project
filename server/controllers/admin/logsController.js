// server/controllers/admin/logsController.js
import pool from "../../config/db.js";

/* ============================================================
    📌 1) 로그인 로그 조회 (최근 30개)
    GET /admin/logs/login
============================================================ */
export const getLoginLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        type,
        action,
        detail,
        time
      FROM user_logs
      WHERE type = 'login'
      ORDER BY id DESC
      LIMIT 30
      `
    );

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error("getLoginLogs error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
    📌 2) 유저 행동 로그 조회 (최근 30개)
    GET /admin/logs/user
============================================================ */
export const getUserLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        type,
        action,
        detail,
        time
      FROM user_logs
      WHERE type = 'action'
      ORDER BY id DESC
      LIMIT 30
      `
    );

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error("getUserLogs error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
    📌 3) 관리자 행동 로그 조회 (최근 30개)
    GET /admin/logs/admin
============================================================ */
export const getAdminLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        id,
        admin_name,
        action,
        target,
        reason,
        time
      FROM admin_logs
      ORDER BY id DESC
      LIMIT 30
      `
    );

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error("getAdminLogs error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
