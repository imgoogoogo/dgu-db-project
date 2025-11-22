// server/controllers/auctionController.js
import pool from "../config/db.js";

/* ----------------------------------------------------
   📌 1. GET /api/auction
      → 경매 목록 조회
---------------------------------------------------- */
export const listAuction = async (req, res) => {
  try {
    const charId = req.user.char_id; // 내 캐릭터 ID

    // 1) 내 골드 가져오기
    const [[me]] = await pool.query(
      "SELECT gold FROM characters WHERE char_id = ?",
      [charId]
    );

    // 2) 전체 경매 아이템 조회
    const [rows] = await pool.query(
      `SELECT a.auction_id, a.price, a.regist_date,
              inv.inventory_id, inv.item_id, inv.char_id AS seller_id,
              it.name, it.type, it.add_hp, it.add_atk, it.add_def,
              ch.name AS sellerName
         FROM auction a
         JOIN inventory inv ON a.inventory_id = inv.inventory_id
         JOIN items it ON inv.item_id = it.item_id
         JOIN characters ch ON inv.char_id = ch.char_id
        ORDER BY a.regist_date DESC`
    );

    // 3) 전체 경매 리스트 (내가 올린 아이템은 제외)
    const auctionItems = rows
      .filter((i) => i.seller_id !== charId) // ⭐ 여기 추가됨
      .map((i) => ({
        id: i.auction_id,
        name: i.name,
        type: i.type,
        hp: i.add_hp,
        atk: i.add_atk,
        def: i.add_def,
        seller: i.sellerName,
        time: i.regist_date,
        price: i.price,
      }));

    // 4) 내가 올린 판매 아이템만 mySales에 포함
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
        time: i.regist_date,
        price: i.price,
      }));

    // ⭐ 최종 응답 구조 (요청한 auctionData 포맷)
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
      { auctionId }
      → 경매 구매 처리
---------------------------------------------------- */
export const buyAuction = async (req, res) => {
  const buyerCharId = req.user.char_id;
  const buyerName = req.user.name;
  const { auctionId } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 정보 조회 + 잠금
    const [aRows] = await conn.query(
      `SELECT a.auction_id, a.price,
              inv.inventory_id, inv.char_id AS seller_char_id
         FROM auction a
         JOIN inventory inv ON a.inventory_id = inv.inventory_id
        WHERE a.auction_id = ? FOR UPDATE`,
      [auctionId]
    );

    if (aRows.length === 0) throw new Error("경매 항목이 존재하지 않습니다.");
    const a = aRows[0];

    if (a.seller_char_id === buyerCharId)
      throw new Error("본인 물건은 구매할 수 없습니다.");

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
      `INSERT INTO inventory (char_id, item_id, equipped, auctioned)
       VALUES (?, ?, 0, 0)`[
        //ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        (buyerCharId, a.item_id)
      ]
    );

    // 5) 경매 종료 + 판매자 인벤토리 auctioned 해제
    await conn.query("UPDATE auction SET quantity = 0 WHERE auction_id = ?", [
      a.auction_id,
    ]);
    await conn.query(
      "UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?",
      [a.inventory_id]
    );

    await conn.commit();
    res.json({ success: true });

    // ⭐ 구매 로그 (트랜잭션 성공 후 기록)
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action, detail) VALUES (?, ?, 'action', '경매 구매', ?)",
      [buyerCharId, buyerName, `auctionId:${auctionId}, price:${a.price}`]
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
      → 판매자가 경매 취소
---------------------------------------------------- */
export const cancelAuction = async (req, res) => {
  const sellerCharId = req.user.char_id;
  const sellerName = req.user.name;
  const { auction_id } = req.body;

  if (!auction_id)
    return res
      .status(400)
      .json({ success: false, message: "auction_id가 필요합니다." });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 정보 + 판매자 확인
    const [aRows] = await conn.query(
      `SELECT a.auction_id,
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

    // 3) 경매 레코드 삭제
    await conn.query("DELETE FROM auction WHERE auction_id = ?", [auction_id]);

    // 4) 커밋
    await conn.commit();
    res.json({ success: true });

    // ⭐ 경매 취소 로그
    await pool.query(
      "INSERT INTO user_logs (char_id, name, type, action, detail) VALUES (?, ?, 'action', '경매 취소', ?)",
      [sellerCharId, sellerName, `auction_id:${auction_id}`]
    );
  } catch (err) {
    await conn.rollback();
    console.error("cancelAuction error:", err);
    res.status(400).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};
