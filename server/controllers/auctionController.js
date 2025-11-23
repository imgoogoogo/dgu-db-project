// server/controllers/auctionController.js
import pool from "../config/db.js";

/* ----------------------------------------------------
   📌 1. GET /api/auction
---------------------------------------------------- */
export const listAuction = async (req, res) => {
  try {
    const charId = req.user.char_id;

    // 1) 내 골드
    const [[me]] = await pool.query(
      "SELECT gold FROM characters WHERE char_id = ?",
      [charId]
    );

    // 2) 경매 목록 (created_at 사용)
    const [rows] = await pool.query(
      `SELECT 
          a.auction_id, a.price, a.created_at,
          inv.inventory_id, inv.item_id, inv.char_id AS seller_id,
          it.name, it.type, it.add_hp, it.add_atk, it.add_def,
          ch.name AS sellerName
       FROM auction a
       JOIN inventory inv ON a.inventory_id = inv.inventory_id
       JOIN items it ON inv.item_id = it.item_id
       JOIN characters ch ON inv.char_id = ch.char_id
       ORDER BY a.created_at DESC`
    );

    // 3) 남의 경매 목록
    const auctionItems = rows
      .filter((i) => i.seller_id !== charId)
      .map((i) => ({
        id: i.auction_id,
        name: i.name,
        type: i.type,
        hp: i.add_hp,
        atk: i.add_atk,
        def: i.add_def,
        seller: i.sellerName,
        time: i.created_at,
        price: i.price,
      }));

    // 4) 내가 올린 경매
    const mySales = rows
      .filter((i) => i.seller_id === charId)
      .map((i) => ({
        id: i.auction_id,
        name: i.name,
        type: i.type,
        hp: i.add_hp,
        atk: i.add_atk,
        def: i.add_def,
        seller: i.sellerName,
        time: i.created_at,
        price: i.price,
      }));

    res.json({
      success: true,
      data: {
        myGold: me.gold,
        auctionItems,
        mySales,
      },
    });
  } catch (err) {
    console.error("listAuction error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------------------------
   📌 2. POST /api/auction/buy
---------------------------------------------------- */
export const buyAuction = async (req, res) => {
  const buyerCharId = req.user.char_id;
  const { auctionId } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 + item_id 포함하여 조회
    const [aRows] = await conn.query(
      `SELECT 
          a.auction_id, a.price,
          inv.inventory_id, inv.item_id,
          inv.char_id AS seller_char_id
       FROM auction a
       JOIN inventory inv ON a.inventory_id = inv.inventory_id
       WHERE a.auction_id = ? FOR UPDATE`,
      [auctionId]
    );

    if (aRows.length === 0) throw new Error("경매 항목이 존재하지 않습니다.");

    const a = aRows[0];

    // 본인 물건 구매 방지
    if (a.seller_char_id === buyerCharId)
      throw new Error("본인 물건은 구매할 수 없습니다.");

    // 2) 구매자 골드 확인
    const [[buyer]] = await conn.query(
      "SELECT gold FROM characters WHERE char_id = ? FOR UPDATE",
      [buyerCharId]
    );

    if (!buyer) throw new Error("구매자 캐릭터가 존재하지 않습니다.");
    if (buyer.gold < a.price) throw new Error("골드가 부족합니다.");

    // 3) 골드 이동
    await conn.query(
      "UPDATE characters SET gold = gold - ? WHERE char_id = ?",
      [a.price, buyerCharId]
    );

    await conn.query(
      "UPDATE characters SET gold = gold + ? WHERE char_id = ?",
      [a.price, a.seller_char_id]
    );

    // 4) 구매자 인벤토리에 아이템 추가
    await conn.query(
      `INSERT INTO inventory (char_id, item_id, equipped, auctioned)
       VALUES (?, ?, 0, 0)`,
      [buyerCharId, a.item_id]
    );

    // 5) 경매 레코드 삭제
    await conn.query("DELETE FROM auction WHERE auction_id = ?", [
      a.auction_id,
    ]);

    // 판매자 인벤토리에 auctioned 해제
    await conn.query(
      "UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?",
      [a.inventory_id]
    );

    await conn.commit();
    res.json({ success: true });

    // ⭐ 구매 로그 (user_logs에는 name 컬럼 없음!)
    await pool.query(
      "INSERT INTO user_logs (char_id, type, action, detail) VALUES (?, 'action', '경매 구매', ?)",
      [buyerCharId, `auctionId:${auctionId}, price:${a.price}`]
    );
  } catch (err) {
    await conn.rollback();
    console.error("buyAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

/* ----------------------------------------------------
   📌 3. DELETE /api/auction/cancel
---------------------------------------------------- */
export const cancelAuction = async (req, res) => {
  const sellerCharId = req.user.char_id;
  const { auction_id } = req.body;

  if (!auction_id)
    return res
      .status(400)
      .json({ success: false, message: "auction_id가 필요합니다." });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 + 판매자 검사
    const [aRows] = await conn.query(
      `SELECT 
          a.auction_id,
          inv.inventory_id,
          inv.char_id AS seller_char_id
       FROM auction a
       JOIN inventory inv ON a.inventory_id = inv.inventory_id
       WHERE a.auction_id = ? FOR UPDATE`,
      [auction_id]
    );

    if (aRows.length === 0) throw new Error("경매 항목이 없습니다.");

    const a = aRows[0];

    if (a.seller_char_id !== sellerCharId)
      throw new Error("본인이 등록한 경매만 취소할 수 있습니다.");

    // 2) 인벤토리 auctioned 해제
    await conn.query(
      "UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?",
      [a.inventory_id]
    );

    // 3) 경매 삭제
    await conn.query("DELETE FROM auction WHERE auction_id = ?", [auction_id]);

    await conn.commit();
    res.json({ success: true });

    // ⭐ 경매 취소 로그 (name 없음)
    await pool.query(
      "INSERT INTO user_logs (char_id, type, action, detail) VALUES (?, 'action', '경매 취소', ?)",
      [sellerCharId, `auction_id:${auction_id}`]
    );
  } catch (err) {
    await conn.rollback();
    console.error("cancelAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
