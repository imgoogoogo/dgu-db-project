// 📁 src/ui/AuctionPopUp.js
export default class AuctionPopUp extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    // ---------------------
    // 기본 패널 설정
    // ---------------------
    const panelWidth = 1200;
    const panelHeight = 700;
    const panel = scene.add.graphics();
    panel.fillStyle(0x11141c, 1);
    panel.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      20
    );
    this.add(panel);

    // ---------------------
    // 헤더 바
    // ---------------------
    const headerBar = scene.add.graphics();
    headerBar.fillStyle(0x1a1d27, 1);
    headerBar.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      60,
      { tl: 20, tr: 20, bl: 0, br: 0 }
    );
    this.add(headerBar);

    // 제목
    const titleText = scene.add.text(
      -panelWidth / 2 + 60,
      -panelHeight / 2 + 15,
      "📦 경매장",
      {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#FFFFFF",
        fontStyle: "bold",
      }
    );
    this.add(titleText);

    // 닫기 버튼
    const closeButton = scene.add
      .text(panelWidth / 2 - 80, -panelHeight / 2 + 15, "닫기", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#FFFFFF",
        backgroundColor: "#b14444",
        padding: { left: 15, right: 15, top: 5, bottom: 5 },
      })
      .setInteractive({ useHandCursor: true });
    closeButton.on("pointerdown", () => this.destroy());
    this.add(closeButton);

    // ---------------------
    // 카테고리 탭
    // ---------------------
    const tabs = ["전체", "무기", "상의", "하의"];
    let startX = -panelWidth / 2 + 50;
    tabs.forEach((label, i) => {
      const tab = scene.add
        .text(startX + i * 80, -panelHeight / 2 + 80, label, {
          fontFamily: "Arial",
          fontSize: "22px",
          color: "#FFFFFF",
        })
        .setInteractive({ useHandCursor: true });
      tab.on("pointerover", () => tab.setColor("#FFD05A"));
      tab.on("pointerout", () => tab.setColor("#FFFFFF"));
      this.add(tab);
    });

    // ---------------------
    // 검색창 (사각형 형태)
    // ---------------------
    const searchBox = scene.add.graphics();
    searchBox.fillStyle(0x1e2230, 1);
    searchBox.fillRoundedRect(-200, -panelHeight / 2 + 65, 400, 40, 10);
    this.add(searchBox);

    const searchText = scene.add.text(
      -180,
      -panelHeight / 2 + 74,
      "아이템 이름 입력...",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#555A6F",
      }
    );
    this.add(searchText);

    // ---------------------
    // 골드 표시
    // ---------------------
    const goldIcon = scene.add.text(
      panelWidth / 2 - 170,
      -panelHeight / 2 + 80,
      "🪙",
      { fontSize: "24px" }
    );
    const goldText = scene.add.text(
      panelWidth / 2 - 140,
      -panelHeight / 2 + 80,
      "7,874",
      {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#FFD05A",
      }
    );
    this.add(goldIcon);
    this.add(goldText);

    // ---------------------
    // 아이템 리스트 영역
    // ---------------------
    const listArea = scene.add.graphics();
    listArea.fillStyle(0x1a1e29, 1);
    listArea.fillRoundedRect(
      -panelWidth / 2 + 40,
      -panelHeight / 2 + 130,
      panelWidth - 80,
      panelHeight - 180,
      15
    );
    this.add(listArea);

    // ---------------------
    // 리스트 예시 아이템 (더미 데이터)
    // ---------------------
    const sampleItem = scene.add.text(
      -panelWidth / 2 + 60,
      -panelHeight / 2 + 150,
      "⚔️ 강철검  |  가격: 500G",
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#FFFFFF",
      }
    );
    const sampleItem2 = scene.add.text(
      -panelWidth / 2 + 60,
      -panelHeight / 2 + 190,
      "🛡️ 가죽갑옷  |  가격: 800G",
      {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#FFFFFF",
      }
    );
    this.add(sampleItem);
    this.add(sampleItem2);

    // ---------------------
    // Phaser Container 등록
    // ---------------------
    scene.add.existing(this);
  }
}
