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
      `SELECT inv.inventory_id, inv.item_id, inv.equipped, inv.auctioned,
              it.name, it.type, it.add_atk, it.add_def, it.add_hp, it.description
       FROM inventory inv
       JOIN items it ON inv.item_id = it.item_id
       WHERE inv.char_id = ? AND inv.auctioned = 0`,
      [charId]
    );

    // 기본 스탯
    const [[base]] = await pool.query(
      "SELECT name, hp, atk, def, gold FROM characters WHERE char_id = ?",
      [charId]
    );

    // 보너스 스탯 계산
    let bonusAtk = 0,
      bonusDef = 0,
      bonusHp = 0;
    for (const it of items) {
      if (it.equipped === 1) {
        bonusAtk += it.add_atk;
        bonusDef += it.add_def;
        bonusHp += it.add_hp;
      }
    }

    // ⭐ 인벤토리 조회 로그 기록
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action) VALUES (?, ?, 'action', '인벤토리 조회')",
      [charId, req.user.name]
    );

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
    const charId = req.user.char_id;
    const { stat } = req.body; // "hp" / "atk" / "def"

    // stat 값 검증
    const allowed = ["hp", "atk", "def"];
    if (!allowed.includes(stat)) {
      return res.status(400).json({
        success: false,
        message: "잘못된 스탯입니다.",
      });
    }

    // 현재 스탯/골드 조회
    const [[chr]] = await pool.query(
      "SELECT gold, hp, atk, def FROM characters WHERE char_id = ?",
      [charId]
    );

    if (!chr) {
      return res.status(404).json({
        success: false,
        message: "캐릭터를 찾을 수 없습니다.",
      });
    }

    // 현재 스탯 값 (hp / atk / def 중 하나)
    const currentValue = chr[stat];

    // 요구 골드 = 현재 스탯 × 10
    const requiredGold = currentValue * 10;

    if (chr.gold < requiredGold) {
      return res.status(400).json({
        success: false,
        message: `골드가 부족합니다. 필요 골드: ${requiredGold}`,
      });
    }

    // 강화 적용 (스탯 +1)
    const newValue = currentValue + 1;

    await pool.query(
      `UPDATE characters 
       SET ${stat} = ?, gold = gold - ?
       WHERE char_id = ?`,
      [newValue, requiredGold, charId]
    );

    // 로그 기록
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action, detail) VALUES (?, ?, 'action', '스탯 강화', ?)",
      [
        charId,
        req.user.name,
        `${stat}: ${currentValue} → ${newValue}, usedGold: ${requiredGold}`,
      ]
    );

    // 최신 정보 반환
    return res.json({
      success: true,
      stat,
      oldValue: currentValue,
      newValue,
      usedGold: requiredGold,
      gold: chr.gold - requiredGold,
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
    const charId = req.user.char_id;
    const { inventory_id, equipped } = req.body;

    // 해당 아이템 가져오기
    const [[item]] = await pool.query(
      "SELECT item_id FROM inventory WHERE inventory_id=? AND char_id=?",
      [inventory_id, charId]
    );
    if (!item)
      return res.status(404).json({ success: false, message: "아이템 없음" });

    if (equipped) {
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
      await pool.query("UPDATE inventory SET equipped=1 WHERE inventory_id=?", [
        inventory_id,
      ]);
    } else {
      // 아이템 장착 해제
      await pool.query(
        "UPDATE inventory SET equipped = 0 WHERE inventory_id = ? AND char_id = ?",
        [inventory_id, charId]
      );

      return res.json({
        success: true,
        message: "아이템 장착 해제 완료",
        equipped: false,
      });
    }

    // ⭐ 아이템 장착 로그
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action, detail) VALUES (?, ?, 'action', '아이템 장착', ?)",
      [
        charId,
        req.user.name,
        `inventory_id:${inventory_id}, item_id:${item.item_id}`,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("equipItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------------------
// 5) 아이템 판매
// ----------------------------------------------------------------------
export const sellItem = async (req, res) => {
  const charId = req.user.char_id;
  const { inventory_id, sellGold } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 해당 인벤토리 조회
    const [[inv]] = await conn.query(
      `SELECT inventory_id, item_id, auctioned
         FROM inventory
        WHERE inventory_id = ? AND char_id = ? FOR UPDATE`,
      [inventory_id, charId]
    );

    if (!inv) throw new Error("판매할 아이템이 없습니다.");
    if (inv.auctioned === 1) throw new Error("이미 판매 등록된 아이템입니다.");

    // 2) 경매 등록
    await conn.query(
      `INSERT INTO auction (inventory_id, price, regist_date)
       VALUES (?, ?, NOW())`,
      [inv.inventory_id, sellGold]
    );

    // 3) 인벤토리에서 auctioned 플래그 업데이트
    await conn.query(
      `UPDATE inventory SET auctioned = 1 WHERE inventory_id = ?`,
      [inventory_id]
    );

    await conn.commit();

    // ⭐ 아이템 판매 로그
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action, detail) VALUES (?, ?, 'action', '아이템 판매', ?)",
      [charId, req.user.name, `inventory_id:${inventory_id}, price:${sellGold}`]
    );

    res.json({
      success: true,
      message: "경매 등록 완료!",
      auction: {
        inventory_id: inv.inventory_id,
        item_id: inv.item_id,
        price: sellGold,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error("sellItem error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
