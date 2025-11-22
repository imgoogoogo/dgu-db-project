// server/controllers/admin/settingsController.js
import pool from "../../config/db.js";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

/* ===============================================
   📌 관리자 계정 조회
   GET /admin/settings/admins
=============================================== */
export const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        admin_id AS id,
        username,
        email,
        role,
        last_login
      FROM admin_accounts
      ORDER BY admin_id ASC
    `);

    res.json({ success: true, admins: rows });
  } catch (err) {
    console.error("getAdmins error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================================
   📌 관리자 계정 생성 (임시)
   POST /admin/settings/admin-create
=============================================== */
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role)
      return res.status(400).json({ success: false, message: "필수 값 누락" });

    await pool.query(
      `
      INSERT INTO admin_accounts (username, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [username, email, password, role]
    );

    res.json({ success: true, message: "관리자 계정 생성 완료" });
  } catch (err) {
    console.error("createAdmin error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================================
   📌 관리자 계정 정보 수정
   POST /admin/settings/admin-edit
=============================================== */
export const editAdmin = async (req, res) => {
  try {
    const { admin_id, email, role } = req.body;

    if (!admin_id)
      return res.status(400).json({ success: false, message: "admin_id 필요" });

    await pool.query(
      `
      UPDATE admin_accounts
      SET email = ?, role = ?
      WHERE admin_id = ?
      `,
      [email, role, admin_id]
    );

    res.json({ success: true, message: "관리자 계정 수정 완료" });
  } catch (err) {
    console.error("editAdmin error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================================
   📌 관리자 계정 삭제
   POST /admin/settings/admin-delete
=============================================== */
export const deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if (!admin_id)
      return res.status(400).json({ success: false, message: "admin_id 필요" });

    await pool.query(
      `
      DELETE FROM admin_accounts
      WHERE admin_id = ?
      `,
      [admin_id]
    );

    res.json({ success: true, message: "관리자 계정 삭제 완료" });
  } catch (err) {
    console.error("deleteAdmin error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================================
   📌 DB 백업 파일 생성
   GET /admin/settings/backup
=============================================== */
export const createBackup = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const backupDir = path.join(__dirname, "../../../backup");
    const filename = `db_${new Date().toISOString().slice(0, 10)}.sql`;
    const filePath = path.join(backupDir, filename);

    exec(
      `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${filePath}`,
      (err) => {
        if (err) {
          console.error("Backup error:", err);
          return res.status(500).json({ success: false, message: "백업 실패" });
        }

        res.json({
          success: true,
          message: "백업 파일 생성 완료",
          file: `/backup/${filename}`,
        });
      }
    );
  } catch (err) {
    console.error("createBackup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================================
   📌 DB 백업 파일 복원
   POST /admin/settings/restore
=============================================== */
export const restoreBackup = async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) return res.status(400).json({ success: false, message: "파일 경로 필요" });

    exec(
      `mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${file}`,
      (err) => {
        if (err) {
          console.error("Restore error:", err);
          return res.status(500).json({ success: false, message: "복원 실패" });
        }

        res.json({ success: true, message: "데이터베이스 복원 완료" });
      }
    );
  } catch (err) {
    console.error("restoreBackup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
