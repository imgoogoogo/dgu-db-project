export default class AuctionScene extends Phaser.Scene {
  constructor() {
    super("AuctionScene");
  }

  preload() {}

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // ----------------------------
    // Background
    // ----------------------------
    this.cameras.main.setBackgroundColor("#1A1D2E");

    // ----------------------------
    // Header Bar
    // ----------------------------
    let header = this.add.rectangle(0, 0, W, 90, 0x252838).setOrigin(0, 0);
    this.add.text(60, 32, "💰  경매장", {
      fontSize: "26px",
      color: "#FFFFFF",
    });

    // 보유 골드 박스
    this.add
      .rectangle(W - 260, 25, 200, 40, 0x2a2d3e, 10)
      .setStrokeStyle(1, 0xffffff, 0.15)
      .setOrigin(0, 0);

    this.add.text(W - 245, 33, "💲 보유 골드: 12,500G", {
      fontSize: "18px",
      color: "#FFD700",
    });

    // 닫기 버튼
    let closeBtn = this.add
      .rectangle(W - 80, 25, 70, 40, 0xdc4444, 1)
      .setOrigin(0, 0)
      .setInteractive();
    this.add.text(W - 55, 33, "닫기", {
      fontSize: "18px",
      color: "#fff",
    });

    closeBtn.on("pointerdown", () => {
      this.scene.stop();
    });

    // ----------------------------
    // Top Main Buttons (경매장 / 내 판매 목록)
    // ----------------------------
    const btnY = 120;
    this.createCategoryButton(30, btnY, 110, 50, "경매장", true);
    this.createCategoryButton(150, btnY, 150, 50, "내 판매 목록", false);

    // ----------------------------
    // Category Filters (전체, 무기, 방어구, 기타)
    // ----------------------------
    const filterY = 190;
    this.createFilterButton(30, filterY, 70, "전체", true);
    this.createFilterButton(110, filterY, 70, "무기", false);
    this.createFilterButton(190, filterY, 90, "방어구", false);
    this.createFilterButton(290, filterY, 70, "기타", false);

    // ----------------------------
    // Search bar
    // ----------------------------
    this.add
      .rectangle(390, filterY, 260, 42, 0xffffff, 0.05)
      .setStrokeStyle(1, 0xffffff, 0.1)
      .setOrigin(0, 0);

    this.add.text(400, filterY + 11, "🔍 아이템 검색...", {
      fontSize: "16px",
      color: "#999",
    });

    // ----------------------------
    // Sort buttons
    // ----------------------------
    this.createSortButton(660, filterY, "최신순");
    this.createSortButton(770, filterY, "가격순");

    // ------------------------------------------------------
    // Scrollable Auction List
    // ------------------------------------------------------
    this.createScrollableList();
  }

  // ============================================================
  // BUTTON HELPERS
  // ============================================================
  createCategoryButton(x, y, w, h, label, active) {
    let fill = active ? 0xffd700 : 0x2a2d3e;
    let strokeAlpha = active ? 0 : 0.15;

    this.add
      .rectangle(x, y, w, h, fill)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, strokeAlpha)
      .setInteractive();

    this.add.text(x + 20, y + 12, label, {
      fontSize: "16px",
      color: active ? "#000" : "#fff",
    });
  }

  createFilterButton(x, y, w, label, active) {
    let fill = active ? 0x4ea8de : 0xffffff;
    let alpha = active ? 1 : 0.05;
    let stroke = active ? 0 : 0.1;

    this.add
      .rectangle(x, y, w, 42, fill, alpha)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, stroke)
      .setInteractive();

    this.add.text(x + 18, y + 10, label, {
      fontSize: "16px",
      color: active ? "#fff" : "#0A0A0A",
    });
  }

  createSortButton(x, y, label) {
    this.add
      .rectangle(x, y, 100, 42, 0xffffff, 0.05)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, 0.1)
      .setInteractive();

    this.add.text(x + 35, y + 10, label, {
      fontSize: "16px",
      color: "#0A0A0A",
    });
  }

  // ============================================================
  // SCROLL LIST
  // ============================================================
  createScrollableList() {
    const W = this.cameras.main.width;
    const listStartY = 260;

    // 더미 아이템 30개 생성
    let items = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        name: "랜덤 아이템 " + (i + 1),
        stat: "+ " + Phaser.Math.Between(10, 100) + " ATK",
        color: 0xff6b6b,
        seller: "User_" + Phaser.Math.Between(1000, 9999),
        time: Phaser.Math.Between(1, 59) + "분 전",
        price: Phaser.Math.Between(1000, 9000) + " G",
      });
    }

    // container
    this.auctionContainer = this.add.container(0, listStartY);

    let y = 0;
    items.forEach((item) => {
      let box = this.createAuctionItem(30, y, item);
      this.auctionContainer.add(box);
      y += 110;
    });

    // 마스크 설정
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(0, listStartY, W, this.cameras.main.height - listStartY);
    const mask = maskShape.createGeometryMask();
    this.auctionContainer.setMask(mask);

    // scroll
    this.input.on("wheel", (pointer, dx, dy) => {
      this.auctionContainer.y -= dy;

      const minY = listStartY - (items.length * 110 - 500);
      const maxY = listStartY;

      this.auctionContainer.y = Phaser.Math.Clamp(
        this.auctionContainer.y,
        minY,
        maxY
      );
    });
  }

  // ------------------------------------------------
  // 개별 아이템 박스
  // ------------------------------------------------
  createAuctionItem(x, y, data) {
    const box = this.add.container(x, y);

    const bg = this.add
      .rectangle(0, 0, 1140, 90, 0x252838)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0xffffff, 0.1);

    const name = this.add.text(20, 15, data.name, {
      fontSize: "20px",
      color: "#fff",
    });

    const statBox = this.add
      .rectangle(20, 50, 60, 26, data.color, 0.2)
      .setOrigin(0, 0)
      .setStrokeStyle(1, data.color, 0.3);
    const statText = this.add.text(30, 55, data.stat, {
      fontSize: "12px",
      color: "#" + data.color.toString(16),
    });

    const seller = this.add.text(250, 25, "판매자: " + data.seller, {
      fontSize: "14px",
      color: "#999",
    });

    const time = this.add.text(250, 50, data.time, {
      fontSize: "14px",
      color: "#999",
    });

    const priceLabel = this.add.text(900, 15, "가격", {
      fontSize: "12px",
      color: "#999",
    });

    const price = this.add.text(900, 40, data.price, {
      fontSize: "24px",
      color: "#FFD700",
    });

    const buyBtn = this.add
      .rectangle(1000, 25, 80, 50, 0xffd700)
      .setOrigin(0, 0)
      .setInteractive();
    const buyText = this.add.text(1020, 40, "구매", {
      fontSize: "18px",
      color: "#000",
    });

    buyBtn.on("pointerdown", () => {
      console.log("구매:", data.name);
    });

    box.add([
      bg,
      name,
      statBox,
      statText,
      seller,
      time,
      priceLabel,
      price,
      buyBtn,
      buyText,
    ]);
    return box;
  }
}
