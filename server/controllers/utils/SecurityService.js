import pool from "../../config/db.js";

/**
 * 캐릭터 존재 여부 + 소유권 검증을 한 번에 처리하는 함수
 * @param {number} userId - 로그인한 유저 ID
 * @param {number} charId - 검증할 캐릭터 ID
 * @returns {boolean} - 검증 성공(true) / 실패(false)
 */
export const verifyCharacter = async (accountId, charId) => {
  try {
    const [rows] = await pool.query(
      `SELECT account_id, char_id
       FROM characters 
       WHERE account_id = ? AND char_id = ?`,
      [accountId, charId]
    );

    // 존재하고 소유권이 맞으면 true 반환
    return rows.length > 0;
  } catch (err) {
    console.error("verifyCharacter error:", err);
    throw new Error("캐릭터 검증 중 오류가 발생했습니다.");
  }
};
