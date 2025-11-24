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
    // const [rows] = await pool.query(
    //   `SELECT
    //       a.auction_id, a.price, a.created_at,
    //       inv.inventory_id, inv.item_id, inv.char_id AS seller_id,
    //       it.name, it.type, it.add_hp, it.add_atk, it.add_def,
    //       ch.name AS sellerName
    //    FROM auction a
    //    JOIN inventory inv ON a.inventory_id = inv.inventory_id
    //    JOIN items it ON inv.item_id = it.item_id
    //    JOIN characters ch ON inv.char_id = ch.char_id
    //    ORDER BY a.created_at DESC`
    // );

    // 3) 남의 경매 목록
    const [auctionItems] = await pool.query(
      `SELECT 
          auction_id AS id,
          item_Id AS itemId,
          item_name AS name,
          item_type AS type,
          add_hp AS hp,
          add_atk AS atk,
          add_def AS def,
          seller_Name AS seller,
          created_at AS time,
          price
       FROM v_auction
       WHERE seller_id != ?
       ORDER BY created_at DESC`,
      [charId]
    );

    // 4) 내가 올린 경매
    const [mySales] = await pool.query(
      `SELECT 
          auction_id AS id,
          item_Id AS itemId,
          item_name AS name,
          item_type AS type,
          add_hp AS hp,
          add_atk AS atk,
          add_def AS def,
          seller_Name AS seller,
          created_at AS time,
          price
       FROM v_auction
       WHERE seller_id = ?
       ORDER BY created_at DESC`,
      [charId]
    );

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
  const { auction_id } = req.body;

  try {
    await pool.query("Call sp_buy_item(?, ?)", [buyerCharId, auction_id]);

    res.json({ success: true });
  } catch (err) {
    console.error("buyAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
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

  try {
    await pool.query("CALL sp_cancel_sell_item(?, ?)", [
      sellerCharId,
      auction_id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("cancelAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
