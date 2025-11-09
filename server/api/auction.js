// server/api/auction.js
// ──────────────────────────────────────────────────────────────
// "경매장" 관련 REST API
// - 등록: 인벤토리 아이템을 경매로 올림 (auction 테이블에 INSERT, inventory.auctioned=1 권장)
// - 목록: 현재 판매중인 아이템 리스트
// - 구매: 단순 예시로 수량 0 처리 + auctioned 해제 (실제론 골드 차감/이체 트랜잭션 필요)
// ──────────────────────────────────────────────────────────────
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * [POST] /api/auction/register
 * - 판매 등록 (inventory_id를 받아 해당 아이템을 경매에 올림)
 * - 정책:
 *   1) auction INSERT
 *   2) inventory.auctioned = 1 로 표시(목록에서 구분)
 * body: { inventory_id, price, quantity }
 */
router.post("/register", async (req, res) => {
  const { inventory_id, price, quantity } = req.body;

  if (!inventory_id || !price || !quantity) {
    return res.status(400).json({
      success: false,
      message: "inventory_id, price, quantity는 모두 필수입니다.",
    });
  }

  // 트랜잭션으로 일괄 처리 (원자성 보장)
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 인벤토리 존재/수량 체크
    const [invRows] = await conn.query(
      `SELECT inventory_id, char_id, quantity, auctioned
         FROM inventory
        WHERE inventory_id = ? FOR UPDATE`,
      [inventory_id]
    );
    if (invRows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ success: false, message: "인벤토리 아이템이 없습니다." });
    }
    const inv = invRows[0];
    if (inv.auctioned) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ success: false, message: "이미 경매중인 아이템입니다." });
    }
    if (inv.quantity < quantity) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ success: false, message: "수량이 부족합니다." });
    }

    // 2) 경매 등록
    await conn.query(
      `INSERT INTO auction (inventory_id, price, quantity, regist_date)
       VALUES (?, ?, ?, NOW())`,
      [inventory_id, price, quantity]
    );

    // 3) 경매 상태 플래그(선택): 전량 경매라면 auctioned=1
    //    부분 경매 정책을 쓸 경우 수량 분리/복제 등의 설계가 필요.
    await conn.query(
      `UPDATE inventory
          SET auctioned = 1
        WHERE inventory_id = ?`,
      [inventory_id]
    );

    await conn.commit();

    return res.json({ success: true, message: "경매 등록 완료" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ /auction/register error:", err);
    return res.status(500).json({ success: false, message: "등록 실패" });
  } finally {
    conn.release();
  }
});

/**
 * [GET] /api/auction/list
 * - 현재 판매중인 아이템 목록
 * - JOIN으로 아이템 이름/판매자 닉네임까지 한번에 조회
 */
router.get("/list", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.auction_id,
        a.price,
        a.quantity,
        a.regist_date,
        it.name         AS item_name,
        it.type         AS item_type,
        it.add_atk,
        it.add_def,
        it.add_hp,
        c.name          AS seller
      FROM auction a
      JOIN inventory i ON a.inventory_id = i.inventory_id
      JOIN items it    ON i.item_id = it.item_id
      JOIN characters c ON i.char_id = c.char_id
      WHERE a.quantity > 0
      ORDER BY a.regist_date DESC
    `);

    return res.json({
      success: true,
      message: "경매 목록 조회 완료",
      data: rows,
    });
  } catch (err) {
    console.error("❌ /auction/list error:", err);
    return res.status(500).json({ success: false, message: "경매 목록 조회 실패" });
  }
});

/**
 * [POST] /api/auction/buy
 * - 아주 단순한 구매 처리 예시:
 *   1) auction 수량 0으로 (판매 완료)
 *   2) inventory.auctioned = 0 해제
 *   ※ 실제 게임머니(골드) 차감/이체, 아이템 소유권 이전은 트랜잭션으로 추가 구현 필요
 * body: { auction_id }
 */
router.post("/buy", async (req, res) => {
  const { auction_id } = req.body;

  if (!auction_id) {
    return res.status(400).json({
      success: false,
      message: "auction_id는 필수입니다.",
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) 경매 레코드 조회 & 잠금
    const [aucRows] = await conn.query(
      `SELECT auction_id, inventory_id, quantity
         FROM auction
        WHERE auction_id = ? FOR UPDATE`,
      [auction_id]
    );
    if (aucRows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ success: false, message: "경매 항목이 없습니다." });
    }
    const auc = aucRows[0];
    if (auc.quantity === 0) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ success: false, message: "이미 판매 완료된 상품입니다." });
    }

    // 2) 판매 완료 처리 (수량 0)
    await conn.query(
      `UPDATE auction SET quantity = 0 WHERE auction_id = ?`,
      [auction_id]
    );

    // 3) 인벤토리 플래그 해제(소유권/수량 이전 정책은 추후 확장)
    await conn.query(
      `UPDATE inventory SET auctioned = 0 WHERE inventory_id = ?`,
      [auc.inventory_id]
    );

    await conn.commit();

    return res.json({ success: true, message: "구매 완료" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ /auction/buy error:", err);
    return res.status(500).json({ success: false, message: "구매 실패" });
  } finally {
    conn.release();
  }
});

export default router;
