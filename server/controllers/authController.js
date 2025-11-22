// server/controllers/authController.js
import axios from "axios";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// 1) 카카오 로그인 URL로 리다이렉트
export const kakaoLogin = (req, res) => {
  const url =
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${process.env.KAKAO_REST_API_KEY}` +
    `&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;

  res.redirect(url);
};

// 2) 카카오 callback 처리
export const kakaoCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // code → access_token
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // access_token → 사용자 정보
    const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const kakaoId = userRes.data.id;
    const nickname = userRes.data.kakao_account.profile.nickname;

    // 3) DB에서 계정 조회 또는 생성
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE login_id = ?",
      [`kakao:${kakaoId}`]
    );

    let accountId;

    if (rows.length === 0) {
      // 신규 계정 생성
      const result = await pool.query(
        "INSERT INTO accounts (login_id) VALUES (?)",
        [`kakao:${kakaoId}`]
      );
      accountId = result[0].insertId;

      // 첫 캐릭터 자동 생성
      await pool.query(
        "INSERT INTO characters (account_id, name) VALUES (?, ?)",
        [accountId, nickname]
      );
    } else {
      accountId = rows[0].account_id;
    }

    // 캐릭터 조회
    const [chr] = await pool.query(
      "SELECT char_id, name FROM characters WHERE account_id = ?",
      [accountId]
    );

    const character = chr[0];

    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action) VALUES (?, ?, 'login', '로그인')",
      [character.char_id, character.name]
    );

    // 4) JWT 발급
    const token = jwt.sign(
      {
        account_id: accountId,
        char_id: character.char_id,
        login_id: `kakao:${kakaoId}`,
        name: character.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`발급된 JWT: ${token}`);
    // 5) 프론트엔드로 JWT 전달
    res.redirect(`http://localhost:3000?jwt=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
