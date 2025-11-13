// server/controllers/inventoryController.js
import pool from "../config/db.js";

// GET /api/inventory  (JWT 필요)
export const getInventory = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 인벤토리 + 아이템 정보
    const [items] = await pool.query(
      `SELECT inv.inventory_id, inv.item_id, inv.quantity, inv.equipped, inv.auctioned,
              it.name, it.type, it.add_atk, it.add_def, it.add_hp
         FROM inventory inv.cha
         JOIN items it ON inv.item_id = it.item_id
        WHERE inv.char_id = ?`,
      [charId]
    );

    // 캐릭터 기본 스탯
    const [chrRows] = await pool.query(
      "SELECT name, hp, atk, def, gold FROM characters WHERE char_id = ?",
      [charId]
    );
    if (chrRows.length === 0) {
      return res.status(404).json({ success: false, message: "캐릭터 없음" });
    }
    const base = chrRows[0];

    // 착용 아이템 스탯 합산
    let bonusAtk = 0, bonusDef = 0, bonusHp = 0;
    for (const it of items) {
      if (it.equipped) {
        bonusAtk += it.add_atk || 0;
        bonusDef += it.add_def || 0;
        bonusHp  += it.add_hp  || 0;
      }
    }

    res.json({
      success: true,
      data: {
        items: items.map((it) => ({
          itemId: it.item_id,
          quantity: it.quantity,
          equipped: !!it.equipped,
          auctioned: !!it.auctioned,
          name: it.name,
          type: it.type,
        })),
        charStats: {
          name: base.name,
          hp: base.hp + bonusHp,
          atk: base.atk + bonusAtk,
          def: base.def + bonusDef,
          gold: base.gold,
        },
      },
    });
  } catch (err) {
    console.error("getInventory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
