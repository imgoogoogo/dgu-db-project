// server/controllers/auctionController.js
import pool from "../config/db.js";

/* ----------------------------------------------------
   📌 1. GET /api/auction
      → 경매 목록 조회
---------------------------------------------------- */
export const listAuction = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.auction_id, a.price, a.quantity, a.regist_date,
              inv.item_id,
              it.name AS item_name,
              ch.name AS sellerName
         FROM auction a
         JOIN inventory inv ON a.inventory_id = inv.inventory_id
         JOIN items it ON inv.item_id = it.item_id
         JOIN characters ch ON inv.char_id = ch.char_id
        WHERE a.quantity > 0
        ORDER BY a.regist_date DESC`
    );

    res.json({ success: true, data: rows });

  } catch (err) {
    console.error("listAuction error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------------------------
   📌 2. POST /api/auction/buy
      { auctionId }
      → 경매 구매 처리
---------------------------------------------------- */
export const buyAuction = async (req, res) => {
  const buyerCharId = req.user.char_id;
  const { auctionId } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 정보 조회 + 잠금
    const [aRows] = await conn.query(
      `SELECT a.auction_id, a.price, a.quantity,
              inv.inventory_id, inv.char_id AS seller_char_id, inv.item_id
         FROM auction a
         JOIN inventory inv ON a.inventory_id = inv.inventory_id
        WHERE a.auction_id = ? FOR UPDATE`,
      [auctionId]
    );

    if (aRows.length === 0) throw new Error("경매 항목이 존재하지 않습니다.");
    const a = aRows[0];

    if (a.quantity <= 0) throw new Error("이미 판매 완료된 경매입니다.");
    if (a.seller_char_id === buyerCharId) throw new Error("본인 물건은 구매할 수 없습니다.");

    // 2) 구매자 골드 확인
    const [[buyer]] = await conn.query(
      "SELECT gold FROM characters WHERE char_id = ? FOR UPDATE",
      [buyerCharId]
    );
    if (!buyer) throw new Error("구매자 캐릭터가 존재하지 않습니다.");
    if (buyer.gold < a.price) throw new Error("골드가 부족합니다.");

    // 3) 골드 이동 (구매자 → 판매자)
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
      `INSERT INTO inventory (char_id, item_id, quantity, equipped, auctioned)
       VALUES (?, ?, ?, 0, 0)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [buyerCharId, a.item_id, a.quantity]
    );

    // 5) 경매 종료 + 판매자 인벤토리 auctioned 해제
    await conn.query("UPDATE auction SET quantity = 0 WHERE auction_id = ?", [
      a.auction_id,
    ]);
    await conn.query("UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?", [
      a.inventory_id,
    ]);

    await conn.commit();
    res.json({ success: true });

  } catch (err) {
    await conn.rollback();
    console.error("buyAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

/* ----------------------------------------------------
   📌 3. DELETE /api/auction/cancel/:auctionId
      → 판매자가 경매 취소
---------------------------------------------------- */
export const cancelAuction = async (req, res) => {
  const sellerCharId = req.user.char_id;
  const { auction_id } = req.body;

  if (!auction_id)
    return res.status(400).json({ success: false, message: "auction_id가 필요합니다." });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [aRows] = await conn.query(
      `SELECT a.auction_id, a.quantity,
              inv.inventory_id, inv.char_id AS seller_char_id
         FROM auction a
         JOIN inventory inv ON a.inventory_id = inv.inventory_id
        WHERE a.auction_id = ? FOR UPDATE`,
      [auction_id]
    );

    if (aRows.length === 0)
      throw new Error("경매 항목이 없습니다.");

    const a = aRows[0];

    if (a.seller_char_id !== sellerCharId)
      throw new Error("본인이 등록한 경매만 취소할 수 있습니다.");

    if (a.quantity <= 0)
      throw new Error("이미 종료된 경매입니다.");

    // 경매 종료 처리
    await conn.query("UPDATE auction SET quantity = 0 WHERE auction_id = ?", [auction_id]);

    // 인벤토리 auctioned 해제
    await conn.query("UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?", [
      a.inventory_id
    ]);

    await conn.commit();
    res.json({ success: true });

  } catch (err) {
    await conn.rollback();
    console.error("cancelAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
