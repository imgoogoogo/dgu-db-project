// server/controllers/admin/balanceController.js
import pool from "../../config/db.js";

/* ============================================================
    📌 1) 아이템 밸런스 (프론트 구조에 맞게 수정 완료)
============================================================ */

/** GET /admin/balance/items */
export const getItemBalance = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        item_id AS id,
        name,
        type,
        add_atk AS add_atk,
        add_def AS add_def,
        add_hp AS add_hp,
        drop_rate AS chance,
        grade
      FROM items
      ORDER BY item_id ASC
    `);

    res.json({ success: true, items: rows });
  } catch (err) {
    console.error("getItemBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /admin/balance/items/save */
export const saveItemBalance = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items))
      return res.status(400).json({
        success: false,
        message: "items 배열이 필요합니다.",
      });

    for (const it of items) {
      await pool.query(
        `
        UPDATE items
        SET add_atk = ?, add_def = ?, add_hp = ?, drop_rate = ?
        WHERE item_id = ?
        `,
        [it.add_atk, it.add_def, it.add_hp, it.chance, it.id]
      );
    }

    res.json({ success: true, message: "아이템 밸런스 저장 완료" });
  } catch (err) {
    console.error("saveItemBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
    📌 2) 몬스터 밸런스 (프론트 구조에 맞게 수정 완료)
============================================================ */

/** GET /admin/balance/monsters */
export const getMonsterBalance = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        monster_id AS id,
        name,
        hp,
        atk AS attack,
        def AS defense,
        chance
      FROM monsters
      ORDER BY monster_id ASC
    `);

    res.json({ success: true, monsters: rows });
  } catch (err) {
    console.error("getMonsterBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /admin/balance/monsters/save */
export const saveMonsterBalance = async (req, res) => {
  try {
    const { monsters } = req.body;

    if (!Array.isArray(monsters))
      return res.status(400).json({
        success: false,
        message: "monsters 배열이 필요합니다.",
      });

    for (const m of monsters) {
      await pool.query(
        `
        UPDATE monsters
        SET hp = ?, atk = ?, def = ?, chance = ?
        WHERE monster_id = ?
        `,
        [m.hp, m.attack, m.defense, m.chance, m.id]
      );
    }

    res.json({ success: true, message: "몬스터 밸런스 저장 완료" });
  } catch (err) {
    console.error("saveMonsterBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
    📌 3) 스테이지 밸런스 (그대로 유지)
============================================================ */

/** GET /admin/balance/stages */
export const getStageBalance = async (req, res) => {
  try {
    const [[row]] = await pool.query(`
      SELECT 
        start_monster AS startMonster,
        increase_per_stage AS increasePerStage,
        spawn_time AS spawnTime,
        base_exp AS baseExp,
        exp_rate AS expRate
      FROM stage_balance
      LIMIT 1
    `);

    res.json({ success: true, ...row });
  } catch (err) {
    console.error("getStageBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /admin/balance/stages/save */
export const saveStageBalance = async (req, res) => {
  try {
    const { startMonster, increasePerStage, spawnTime, baseExp, expRate } =
      req.body;

    await pool.query(
      `
      UPDATE stage_balance
      SET start_monster = ?, increase_per_stage = ?, spawn_time = ?, base_exp = ?, exp_rate = ?
      `,
      [startMonster, increasePerStage, spawnTime, baseExp, expRate]
    );

    res.json({ success: true, message: "스테이지 밸런스 저장 완료" });
  } catch (err) {
    console.error("saveStageBalance error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
