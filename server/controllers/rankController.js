// server/controllers/rankController.js
import pool from "../config/db.js";

// GET /api/ranking
export const getRanking = async (req, res) => {
  const myCharId = req.user.char_id;

  try {
    // 1) 전체 랭킹 100명 조회 (이미 정렬 포함)
    const [rows] = await pool.query(
      `SELECT char_id, name AS nickName, max_stage AS maxStage, 
              survived_time AS playTime, last_played_at AS lastPlayed
       FROM characters
       ORDER BY max_stage DESC, gold DESC
       LIMIT 100`
    );

    // 2) 랭킹 번호 추가
    const rankings = rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

    // 3) 내 랭킹 계산
    let myRanking = null;

    // 3-1) 만약 top100 안에 있다면 rankings에서 찾기
    const inTop100 = rankings.find((x) => x.char_id === myCharId);
    if (inTop100) {
      myRanking = {
        rank: inTop100.rank,
        nickName: inTop100.nickName,
        maxStage: inTop100.maxStage,
        playTime: inTop100.playTime,
        lastPlayed: inTop100.lastPlayed,
      };
    } else {
      // top100 밖이면 전체 등수 다시 계산
      const [[me]] = await pool.query(
        `SELECT 
           (SELECT COUNT(*) + 1 
              FROM characters 
             WHERE max_stage > c.max_stage 
                OR (max_stage = c.max_stage AND gold > c.gold)
           ) AS rank,
           name AS nickName,
           max_stage AS maxStage,
           survived_time AS playTime,
           last_played_at AS lastPlayed
         FROM characters c
         WHERE char_id = ?`,
        [myCharId]
      );

      myRanking = me;
    }

    // 4) 프론트에서 요구하는 형식으로 반환
    return res.json({
      success: true,
      myRanking,
      rankings,
    });

  } catch (err) {
    console.error("getRanking error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
