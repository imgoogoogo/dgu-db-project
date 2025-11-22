import pool from "../../config/db.js";
import moment from "moment";
import "moment/locale/ko.js";
moment.locale("ko");

// ================================
// 1) 유저 목록 조회 / 검색
// ================================
export const getUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword ?? "";

    const [users] = await pool.query(
      `
      SELECT 
        ch.char_id AS id,
        ch.name AS username,
        ch.hp,
        ch.atk,
        ch.def,
        ch.gold,
        ch.state
      FROM characters ch
      WHERE ch.name LIKE ?
      ORDER BY ch.char_id ASC
      `,
      [`%${keyword}%`]
    );

    // 🔥 각 유저의 최근 로그인 시간 가져오기
    for (const user of users) {
      const [[log]] = await pool.query(
        `
        SELECT created_at 
        FROM user_logs
        WHERE name = ?
        AND type = 'login'
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [user.username]
      );

      user.lastLogin = log ? moment(log.time).fromNow() : "기록 없음";
    }

    res.json({ users });
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 2) 아이템 지급
// ================================
export const giveItem = async (req, res) => {
  try {
    const { userId, itemId, amount, reason } = req.body;
    const adminName = req.user?.admin_name ?? "관리자";

    if (!userId || !itemId || !amount)
      return res.status(400).json({ message: "필수값 누락" });

    await pool.query(
      `
      INSERT INTO inventory (char_id, item_id, equipped, auctioned)
      VALUES (?, ?, 0, 0)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `,
      [userId, itemId, amount]
    );

    // 관리자 로그 기록
    await pool.query(
      `
      INSERT INTO admin_logs (admin_name, action, target, reason)
      VALUES (?, '아이템 지급', ?, ?)
      `,
      [adminName, userId, reason]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("giveItem error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 3) 골드 지급
// ================================
export const giveGold = async (req, res) => {
  try {
    const { userId, gold, reason } = req.body;
    const adminName = req.user?.admin_name ?? "관리자";

    if (!userId || !gold)
      return res.status(400).json({ message: "필수값 누락" });

    await pool.query(
      `
      UPDATE characters
      SET gold = gold + ?
      WHERE char_id = ?
      `,
      [gold, userId]
    );

    await pool.query(
      `
      INSERT INTO admin_logs (admin_name, action, target, reason)
      VALUES (?, '골드 지급', ?, ?)
      `,
      [adminName, userId, reason]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("giveGold error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 4) 유저 제재
// ================================
export const banUser = async (req, res) => {
  try {
    console.log("jhh");
    const { userId, duration, reason } = req.body;
    const adminName = req.user?.admin_name ?? "관리자";

    if (!userId || !duration)
      return res.status(400).json({ message: "필수값 누락" });

    let banUntil = null;

    if (duration === "permanent") {
      banUntil = "9999-12-31";
    } else {
      const d = parseInt(duration.replace("d", ""));
      banUntil = moment().add(d, "days").format("YYYY-MM-DD HH:mm:ss");
    }

    await pool.query(
      `
      UPDATE accounts
      SET banned = 1, banned_until = ?, banned_reason = ?
      WHERE account_id = ?
      `,
      [duration, reason, userId]
    );

    await pool.query(
      `
      INSERT INTO admin_logs (admin_name, action, target_char_id, reason)
      VALUES (?, '유저 제재', ?, ?)
      `,
      [adminName, userId, reason]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("banUser error:", err);
    res.status(500).json({ message: err.message });
  }
};
