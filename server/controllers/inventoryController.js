// server/controllers/inventoryController.js
import pool from "../config/db.js";

// ----------------------------------------------------------------------
// 1) 인벤토리 조회
// ----------------------------------------------------------------------
export const getInventory = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 아이템 조회
    const [items] = await pool.query(
      `SELECT inv.inventory_id, inv.item_id, inv.quantity, inv.equipped, inv.auctioned,
              it.name, it.type, it.add_atk, it.add_def, it.add_hp, it.description
       FROM inventory inv
       JOIN items it ON inv.item_id = it.item_id
       WHERE inv.char_id = ?`,
      [charId]
    );

    // 기본 스탯
    const [[base]] = await pool.query(
      "SELECT name, hp, atk, def, gold FROM characters WHERE char_id = ?",
      [charId]
    );

    // 보너스 스탯 계산
    let bonusAtk = 0, bonusDef = 0, bonusHp = 0;
    for (const it of items) {
      if (it.equipped === 1) {
        bonusAtk += it.add_atk;
        bonusDef += it.add_def;
        bonusHp += it.add_hp;
      }
    }

    res.json({
      success: true,
      data: {
        myGold: base.gold,
        playerStats: {
          totalHp: base.hp + bonusHp,
          totalAtk: base.atk + bonusAtk,
          totalDef: base.def + bonusDef,
        },
        inventoryItems: items.map((i) => ({
          id: i.inventory_id,
          itemId: i.item_id,
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
export const enhanceStats = async (req, res) => {
  try {
    const charId = req.user.char_id;
    const { hp, atk, def, usedGold } = req.body;

    // 현재 골드 확인
    const [[chr]] = await pool.query(
      "SELECT gold FROM characters WHERE char_id = ?",
      [charId]
    );

    if (!chr) {
      return res.status(404).json({
        success: false,
        message: "캐릭터를 찾을 수 없습니다."
      });
    }

    if (chr.gold < usedGold) {
      return res.status(400).json({
        success: false,
        message: "골드가 부족합니다."
      });
    }

    // 클라에서 보낸 값 그대로 저장
    await pool.query(
      `UPDATE characters
       SET hp = ?, atk = ?, def = ?, gold = gold - ?
       WHERE char_id = ?`,
      [hp, atk, def, usedGold, charId]
    );

    return res.json({
      success: true,
      stats: {
        hp,
        atk,
        def,
        gold: chr.gold - usedGold,
      },
    });

  } catch (err) {
    console.error("enhanceStats error:", err);
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
    const charId = req.user.char_id;
    const { inventory_id } = req.body;

    // 해당 아이템 가져오기
    const [[item]] = await pool.query(
      "SELECT item_id FROM inventory WHERE inventory_id=? AND char_id=?",
      [inventory_id, charId]
    );
    if (!item)
      return res.status(404).json({ success: false, message: "아이템 없음" });

    // 같은 타입의 아이템 모두 해제
    await pool.query(
      `UPDATE inventory inv
       JOIN items it ON inv.item_id = it.item_id
       SET inv.equipped = 0
       WHERE inv.char_id=? AND it.type = (
         SELECT type FROM items WHERE item_id = ?
       )`,
      [charId, item.item_id]
    );

    // 선택 아이템 장착
    await pool.query(
      "UPDATE inventory SET equipped=1 WHERE inventory_id=?",
      [inventory_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("equipItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------------------
// 4) 아이템 장착 해제
// ----------------------------------------------------------------------
export const unequipItem = async (req, res) => {
  try {
    const { inventory_id } = req.body;
    await pool.query("UPDATE inventory SET equipped=0 WHERE inventory_id=?", [
      inventory_id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("unequipItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------------------
// 5) 아이템 판매
// ----------------------------------------------------------------------
// 4) 아이템 판매 → 인벤토리 + 경매 등록까지 모두 처리
export const sellItem = async (req, res) => {
  const charId = req.user.char_id;
  const { inventory_id, sellGold } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 해당 인벤토리 조회
    const [[inv]] = await conn.query(
      `SELECT inventory_id, item_id, quantity, auctioned
         FROM inventory
        WHERE inventory_id = ? AND char_id = ? FOR UPDATE`,
      [inventory_id, charId]
    );

    if (!inv) throw new Error("판매할 아이템이 없습니다.");
    if (inv.auctioned === 1) throw new Error("이미 판매 등록된 아이템입니다.");

    // 2) 경매 등록
    await conn.query(
      `INSERT INTO auction (inventory_id, quantity, price, regist_date)
       VALUES (?, ?, ?, NOW())`,
      [inv.inventory_id, inv.quantity, sellGold]
    );

    // 3) 인벤토리에서 auctioned 플래그 업데이트
    await conn.query(
      `UPDATE inventory SET auctioned = 1 WHERE inventory_id = ?`,
      [inventory_id]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "경매 등록 완료!",
      auction: {
        inventory_id: inv.inventory_id,
        item_id: inv.item_id,
        quantity: inv.quantity,
        price: sellGold
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error("sellItem error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
