// server/api/inventory.js
// ──────────────────────────────────────────────────────────────
// "인벤토리" 관련 REST API
// ※ 보안 측면에서 최종본은 JWT 인증으로 "본인 인벤토리만" 볼 수 있게 해야 함.
//   현재는 개발/테스트 편의를 위해 char_id를 path로 받는 버전.
//   (나중에 req.user.char_id처럼 토큰에서 추출하도록 변경)
// ──────────────────────────────────────────────────────────────
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * [GET] /api/inventory/:char_id
 * - 특정 캐릭터의 인벤토리 목록을 아이템 정보와 함께 조회
 * - JOIN: inventory(i) ↔ items(it)
 */
router.get("/:char_id", async (req, res) => {
  const { char_id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        i.inventory_id,
        i.char_id,
        i.item_id,
        i.quantity,
        i.equipped,
        i.auctioned,
        it.name       AS item_name,
        it.type       AS item_type,    -- type 칼럼이 있다면 사용
        it.add_atk,
        it.add_def,
        it.add_hp,
        it.description
      FROM inventory i
      JOIN items it ON i.item_id = it.item_id
      WHERE i.char_id = ?
      ORDER BY i.inventory_id DESC
      `,
      [char_id]
    );

    return res.json({
      success: true,
      message: "인벤토리 조회 완료",
      data: rows,
    });
  } catch (err) {
    console.error("❌ /inventory/:char_id error:", err);
    return res.status(500).json({ success: false, message: "인벤토리 조회 실패" });
  }
});

/**
 * [POST] /api/inventory/add
 * - 인벤토리에 아이템 추가
 * - 정책:
 *   1) 동일 item_id가 이미 있으면 quantity만 증가 (스택형 아이템)
 *   2) 장비처럼 비스택형이라면 insert 분기(프로젝트 정책에 맞게 선택)
 * body: { char_id, item_id, quantity=1 }
 */
router.post("/add", async (req, res) => {
  const { char_id, item_id, quantity = 1 } = req.body;

  if (!char_id || !item_id) {
    return res.status(400).json({
      success: false,
      message: "char_id와 item_id는 필수입니다.",
    });
  }

  try {
    // 1) 같은 아이템 존재 여부 확인 (스택형 예시)
    const [exist] = await pool.query(
      `SELECT inventory_id, quantity
         FROM inventory
        WHERE char_id = ? AND item_id = ? AND auctioned = 0`,
      [char_id, item_id]
    );

    if (exist.length > 0) {
      // 2) 이미 있다면 수량 증가
      const inv = exist[0];
      await pool.query(
        `UPDATE inventory
            SET quantity = ?
          WHERE inventory_id = ?`,
        [inv.quantity + quantity, inv.inventory_id]
      );
    } else {
      // 3) 없다면 새로 추가 (equip/auctioned 기본 false)
      await pool.query(
        `INSERT INTO inventory (char_id, item_id, quantity, equipped, auctioned)
         VALUES (?, ?, ?, 0, 0)`,
        [char_id, item_id, quantity]
      );
    }

    return res.json({
      success: true,
      message: "아이템 추가 완료",
    });
  } catch (err) {
    console.error("❌ /inventory/add error:", err);
    return res.status(500).json({ success: false, message: "아이템 추가 실패" });
  }
});

/**
 * [DELETE] /api/inventory/remove
 * - inventory_id 기준으로 해당 인벤토리 아이템 삭제
 * - 실제 서비스에서는 "사용"과 "삭제"를 구분하거나, 수량 차감 로직을 두기도 함.
 * body: { inventory_id }
 */
router.delete("/remove", async (req, res) => {
  const { inventory_id } = req.body;

  if (!inventory_id) {
    return res.status(400).json({
      success: false,
      message: "inventory_id는 필수입니다.",
    });
  }

  try {
    await pool.query(`DELETE FROM inventory WHERE inventory_id = ?`, [inventory_id]);
    return res.json({ success: true, message: "아이템 삭제 완료" });
  } catch (err) {
    console.error("❌ /inventory/remove error:", err);
    return res.status(500).json({ success: false, message: "아이템 삭제 실패" });
  }
});

export default router;
