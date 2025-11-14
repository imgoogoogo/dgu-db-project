export default class InventoryScene extends Phaser.Scene {
  constructor() {
    super("InventoryScene");
  }

  preload() {
    // 필요한 에셋이 있다면 여기에 로드
    this.load.setPath("assets/");
    this.load.image("close_button", "button/close_button.png");
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.cameras.main.setBackgroundColor("#1A1D2E");

    /* -------------------------------------------------------
     *  Top Navigation Bar
     * ------------------------------------------------------- */
    const topBar = this.add.graphics();
    topBar.fillStyle(0x252838, 1);
    topBar.fillRect(0, 0, W, 60);
    topBar.lineStyle(1, 0xffffff, 0.1);
    topBar.strokeRect(0, 0, W, 60);

    this.add.image(W / 2 - 60, 33, "icon_inventory").setScale(0.5);
    // Title Text
    this.add
      .text(W / 2, 33, "인벤토리", {
        fontFamily: "Inter",
        fontSize: "20px",
        color: "#FFFFFF",
      })
      .setOrigin(0.5, 0.5);

    // Close Button
    const closeBtn = this.add
      .image(W - 60, 33, "close_button")
      .setScale(0.4)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainScene");
      });

    /* -------------------------------------------------------
     *  Layout Wrapper
     * ------------------------------------------------------- */
    const wrapperPadding = -5;

    // 전체 레이아웃 영역 계산
    const contentY = 89;
    const contentH = H - contentY;

    /* -------------------------------------------------------
     *  LEFT – Player Info & Equipped
     * ------------------------------------------------------- */
    const leftWidth = 380;
    const leftX = wrapperPadding + 30;
    const leftY = contentY + wrapperPadding;

    /*
     * Player Stats Box
     */
    const playerBox = this.add.graphics();
    playerBox.fillStyle(0x252838, 1);
    playerBox.lineStyle(1, 0xffffff, 0.1);
    playerBox.strokeRoundedRect(leftX, leftY, leftWidth, 198, 16);
    playerBox.fillRoundedRect(leftX, leftY, leftWidth, 198, 16);
    playerBox.lineStyle(1, 0xffffff, 0.1);
    playerBox.strokeRoundedRect(leftX, leftY, leftWidth, 198, 16);

    this.add.text(leftX + 25, leftY + 25, "플레이어", {
      fontFamily: "Inter",
      fontSize: "20px",
      color: "#FFFFFF",
    });

    // Gold
    this.add.image(leftX + 270, leftY + 34, "icon_gold").setScale(0.7);
    this.add.text(leftX + 290, leftY + 27, "7,874", {
      fontFamily: "pretendard",
      fontSize: "16px",
      color: "#FBBF24",
    });

    /* Stats List */
    const stats = [
      { icon: "❤️", label: "총 체력", base: 100, plus: 30 },
      { icon: "🗡️", label: "총 공격력", base: 100, plus: 50 },
      { icon: "🛡️", label: "총 방어력", base: 50, plus: 30 },
    ];

    let statY = leftY + 90;

    stats.forEach((stat) => {
      this.add.text(leftX + 25, statY, `${stat.icon}  ${stat.label}`, {
        fontFamily: "Inter",
        fontSize: "16px",
        color: "#ffffff",
      });

      // stat.base만 흰색, (+stat.plus)는 초록색
      this.add.text(leftX + 250, statY, `${stat.base}`, {
        fontFamily: "Inter",
        fontSize: "16px",
        color: "#FFFFFF", // 흰색
      });
      this.add.text(leftX + 250 + 40, statY, `(+${stat.plus})`, {
        fontFamily: "Inter",
        fontSize: "16px",
        color: "#16A34A", // 초록색
      });

      statY += 32;
    });

    /*
     * Equipped Box
     */
    const eqBoxY = leftY + 198 + 24;
    const eqBoxHeight = 429;

    const eqBox = this.add.graphics();
    eqBox.fillStyle(0x252838, 1);
    eqBox.lineStyle(1, 0xffffff, 0.1);
    eqBox.strokeRoundedRect(leftX, eqBoxY, leftWidth, eqBoxHeight, 16);
    eqBox.fillRoundedRect(leftX, eqBoxY, leftWidth, eqBoxHeight, 16);
    eqBox.lineStyle(1, 0xffffff, 0.1);
    eqBox.strokeRoundedRect(leftX, eqBoxY, leftWidth, eqBoxHeight, 16);

    this.add.text(leftX + 25, eqBoxY + 20, "착용 중", {
      fontFamily: "Inter",
      fontSize: "16px",
      color: "#FFFFFF",
    });

    // 각 슬롯별로 착용하지 않았을 때 안내 문구와 점, 상자 직접 추가
    // 모자
    {
      const y = eqBoxY + 60;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "모자-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }
    // 상의
    {
      const y = eqBoxY + 120;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "상의-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }
    // 하의
    {
      const y = eqBoxY + 180;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "하의-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }
    // 신발
    {
      const y = eqBoxY + 240;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "신발-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }
    // 장갑
    {
      const y = eqBoxY + 300;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "장갑-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }
    // 반지
    {
      const y = eqBoxY + 360;
      const box = this.add.graphics();
      box.lineStyle(1, 0x2a2d3e, 1);
      box.fillStyle(0x1a1d2e, 1);
      box.fillRoundedRect(leftX + 25, y, 330, 50, 10);

      this.add.circle(
        leftX + 45,
        y + 25,
        6,
        Phaser.Display.Color.HexStringToColor("#888888").color
      );

      this.add.text(leftX + 65, y + 15, "반지-아이템을 착용하세요", {
        fontSize: "14px",
        color: "#888888",
      });
    }

    /* -------------------------------------------------------
     *  RIGHT – Tabs + Item List
     * ------------------------------------------------------- */
    const rightX = leftX + leftWidth + 24;
    const rightWidth = W - rightX - wrapperPadding - 30;

    const rightBox = this.add.graphics();
    rightBox.fillStyle(0x252838, 1);
    rightBox.fillRoundedRect(rightX, leftY, rightWidth, 651, 16);
    rightBox.lineStyle(1, 0xffffff, 0.1);
    rightBox.strokeRoundedRect(rightX, leftY, rightWidth, 651, 16);

    /* Tabs */
    const tabs = ["전체", "무기", "상의", "하의"];
    let tabX = rightX + 24;

    tabs.forEach((tab, idx) => {
      const isActive = idx === 0;

      const tabBtn = this.add.graphics();
      tabBtn.fillStyle(isActive ? 0x3a3d4e : 0x000000, isActive ? 1 : 0);
      tabBtn.fillRoundedRect(tabX, leftY + 24, 60, 40, 10);

      this.add.text(tabX + 18, leftY + 32, tab, {
        fontSize: "16px",
        color: isActive ? "#FFFFFF" : "#999999",
      });

      tabX += 76;
    });

    /* Item List Container */
    const listY = leftY + 84;
    const listHeight = 537;

    const listBox = this.add.graphics();
    listBox.fillStyle(0x1a1d2e, 0.5);
    listBox.lineStyle(1, 0xffffff, 0.05);
    listBox.strokeRoundedRect(
      rightX + 24,
      listY,
      rightWidth - 48,
      listHeight,
      10
    );
    listBox.fillRoundedRect(
      rightX + 24,
      listY,
      rightWidth - 48,
      listHeight,
      10
    );

    /* Item List (Dummy Data) */
    const items = [
      {
        typeColor: "#FFB347",
        name: "전설의 검",
        stat: "+50 공격",
        statColor: "#4EA8DE",
        action: "해제",
        actionColor: 0xdc4444,
      },
      {
        typeColor: "#A855F7",
        name: "철갑 갑옷",
        stat: "+30 방어",
        statColor: "#FF6B6B",
        action: "해제",
        actionColor: 0xdc4444,
      },
      {
        typeColor: "#4EA8DE",
        name: "강철 투구",
        stat: "+20 방어",
        statColor: "#FF6B6B",
        action: "착용",
        actionColor: 0x16a34a,
      },
      {
        typeColor: "#4EA8DE",
        name: "가죽 부츠",
        stat: "+15 방어",
        statColor: "#FF6B6B",
        action: "착용",
        actionColor: 0x16a34a,
      },
    ];

    let itemY = listY + 16;

    items.forEach((item) => {
      const it = this.add.graphics();
      it.fillStyle(0x1a1d2e, 1);
      it.lineStyle(1, 0x2a2d3e, 1);
      it.strokeRoundedRect(rightX + 40, itemY, rightWidth - 80, 50, 10);
      it.fillRoundedRect(rightX + 40, itemY, rightWidth - 80, 50, 10);

      this.add.circle(
        rightX + 60,
        itemY + 25,
        6,
        Phaser.Display.Color.HexStringToColor(item.typeColor).color
      );

      this.add.text(rightX + 80, itemY + 15, item.name, {
        fontSize: "16px",
        color: "#FFFFFF",
      });

      this.add.text(rightX + 160, itemY + 15, item.stat, {
        fontSize: "14px",
        color: item.statColor,
      });

      const btn = this.add.graphics();
      btn.fillGradientStyle(
        item.actionColor,
        item.actionColor,
        item.actionColor,
        item.actionColor,
        1
      );
      btn.fillRoundedRect(rightX + rightWidth - 140, itemY + 12, 60, 24, 4);

      this.add.text(rightX + rightWidth - 122, itemY + 16, item.action, {
        fontSize: "12px",
        color: "#FFFFFF",
      });

      itemY += 60;
    });
  }
}
