// server/controllers/rankController.js
import pool from "../config/db.js";

// GET /api/ranking
export const getRanking = async (req, res) => {
  const myCharId = req.user.char_id;

  try {
    // 1) 전체 랭킹 Top 100 조회 (정렬 기준: best_stage → gold)
    const [rows] = await pool.query(
      `SELECT 
         nickName,
         maxStage,
         playTime,
         lastPlayed
       FROM v_ranking
       LIMIT 100`
    );

    // 2) 순위 번호 붙이기
    const rankings = rows.map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

    // 3) 내 랭킹 찾기
    let myRanking = null;

    // top100 안에 있는 경우
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
      // top100 밖이면 전체 순위 계산
      const [[me]] = await pool.query(
        `SELECT 
           (
             SELECT COUNT(*) + 1
             FROM characters
             WHERE best_stage > c.best_stage
                OR (best_stage = c.best_stage AND gold > c.gold)
           ) AS rank,
           name AS nickName,
           best_stage AS maxStage,
           DATE_FORMAT(c.best_survived_time, '%Hh:%im:%ss') AS playTime,
           best_played_date AS lastPlayed
         FROM characters c
         WHERE char_id = ?`,
        [myCharId]
      );

      myRanking = me;
    }

    // 4) 최종 응답
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
