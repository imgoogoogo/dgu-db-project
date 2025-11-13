// server/controllers/authController.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// POST /api/auth/login  { kakaoToken }
export const login = async (req, res) => {
  const { kakaoToken } = req.body;

  if (!kakaoToken) {
    return res.status(400).json({ success: false, message: "kakaoToken 필요" });
  }

  const loginId = "kakao:" + kakaoToken; // 실제 서비스에서는 카카오 프로필 기반으로 변경

  try {
    // 1) accounts 조회 or 생성
    const [accRows] = await pool.query(
      "SELECT account_id FROM accounts WHERE login_id = ?",
      [loginId]
    );

    let accountId;
    if (accRows.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO accounts (login_id, password, banned, create_date) VALUES (?, '', 0, NOW())",
        [loginId]
      );
      accountId = result.insertId;
    } else {
      accountId = accRows[0].account_id;
    }

    // 2) characters 조회 or 기본 캐릭 생성
    const [chrRows] = await pool.query(
      "SELECT char_id, name FROM characters WHERE account_id = ? LIMIT 1",
      [accountId]
    );

    let charId;
    let name;
    if (chrRows.length === 0) {
      const defaultName = "Survivor";
      const [cResult] = await pool.query(
        "INSERT INTO characters (account_id, name, hp, atk, def, gold, max_stage) VALUES (?, ?, 100, 10, 5, 0, 1)",
        [accountId, defaultName]
      );
      charId = cResult.insertId;
      name = defaultName;
    } else {
      charId = chrRows[0].char_id;
      name = chrRows[0].name;
    }

    // 3) JWT 발급
    const token = jwt.sign(
      { account_id: accountId, char_id: charId, name },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ success: true, data: { playerId: charId, jwt: token } });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/logout
export const logout = async (_req, res) => {
  // 서버에 세션 저장 안 하므로 클라이언트에서 토큰만 버리면 됨
  res.json({ success: true });
};
