// server/controllers/inventoryController.js
import pool from "../config/db.js";
import { verifyCharacter } from "./utils/SecurityService.js";

// ----------------------------------------------------------------------
// 1) 인벤토리 조회
// ----------------------------------------------------------------------
export const getInventory = async (req, res) => {
  try {
    const userId = req.user.account_id;
    const charId = req.user.char_id;
    console.log(`Fetching inventory for userId: ${userId}, charId: ${charId}`);

    // 캐릭터 존재 여부 및 캐릭터 소유권 확인
    const isValidCharacter = await verifyCharacter(userId, charId);
    if (!isValidCharacter) {
      return res
        .status(403)
        .json({ success: false, message: "캐릭터 검증에 실패함." });
    }

    // 골드 + 기본 스탯 + 보너스 스탯을 쿼리에서 한 번에 합산
    const [info] = await pool.query(
      `SELECT
        c.gold,
        c.hp AS baseHp,
        c.atk AS baseAtk,
        c.def AS baseDef,
        ces.bonusHp,
        ces.bonusAtk,
        ces.bonusDef
      FROM characters c
      LEFT JOIN v_character_equipped_stats ces 
      ON ces.char_id = c.char_id
      WHERE c.char_id = ?`,
      [charId]
    );

    // 아이템 조회 (auctioned=0만)
    const [items] = await pool.query(
      `SELECT inv.inventory_id, inv.item_id, inv.equipped, inv.auctioned,
              it.name, it.type, it.add_atk, it.add_def, it.add_hp, it.description
       FROM inventory inv
       JOIN items it ON inv.item_id = it.item_id
       WHERE inv.char_id = ? AND inv.auctioned = 0
       ORDER BY inv.equipped DESC, it.type ASC, it.item_id ASC`,
      [charId]
    );

    const base_stats = info[0];
    const bonus_stats = {
      bonusHp: base_stats.bonusHp || 0,
      bonusAtk: base_stats.bonusAtk || 0,
      bonusDef: base_stats.bonusDef || 0,
    };

    res.json({
      success: true,
      data: {
        myGold: base_stats.gold,
        playerStats: {
          baseHp: Number(base_stats.baseHp),
          baseAtk: Number(base_stats.baseAtk),
          baseDef: Number(base_stats.baseDef),
          bonusHp: Number(bonus_stats.bonusHp),
          bonusAtk: Number(bonus_stats.bonusAtk),
          bonusDef: Number(bonus_stats.bonusDef),
        },
        inventoryItems: items.map((i) => ({
          id: i.inventory_id,
          name: i.name,
          type: i.type,
          hp: i.add_hp,
          atk: i.add_atk,
          def: i.add_def,
          equipped: !!i.equipped,
          desc: i.description,
        })),
      },
    });
  } catch (err) {
    console.error("getInventory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------------------
// 2) 능력치 강화 버튼
// ----------------------------------------------------------------------
export const enhanceStat = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const charId = req.user.char_id;
    const { stat } = req.body;

    // 캐릭터 존재 여부 및 캐릭터 소유권 확인
    const isValidCharacter = await verifyCharacter(accountId, charId);
    if (!isValidCharacter) {
      return res
        .status(403)
        .json({ success: false, message: "캐릭터 검증에 실패함." });
    }

    const [row] = await pool.query(`CALL sp_enhance_stat(?, ?)`, [
      charId,
      stat,
    ]);

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("enhanceStat error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ----------------------------------------------------------------------
// 3) 아이템 장착
// ----------------------------------------------------------------------
export const equipItem = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const charId = req.user.char_id;
    const { inventory_id, equipped } = req.body;

    // 캐릭터 존재 여부 및 캐릭터 소유권 확인
    const isValidCharacter = await verifyCharacter(accountId, charId);
    if (!isValidCharacter) {
      return res
        .status(403)
        .json({ success: false, message: "캐릭터 검증에 실패함." });
    }

    const [[item]] = await pool.query("CALL sp_equip_item(?, ?, ?)", [
      charId,
      inventory_id,
      equipped,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("equipItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------------------
// 5) 아이템 판매 → 경매 등록
// ----------------------------------------------------------------------
export const sellItem = async (req, res) => {
  const accountId = req.user.account_id;
  const charId = req.user.char_id;
  const { inventory_id, sellGold } = req.body;

  // 캐릭터 존재 여부 및 캐릭터 소유권 확인
  const isValidCharacter = await verifyCharacter(accountId, charId);
  if (!isValidCharacter) {
    return res
      .status(403)
      .json({ success: false, message: "캐릭터 검증에 실패함." });
  }

  try {
    const [row] = await pool.query("CALL sp_sell_item(?, ?, ?)", [
      charId,
      inventory_id,
      sellGold,
    ]);

    const result = row[0];

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("sellItem error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
