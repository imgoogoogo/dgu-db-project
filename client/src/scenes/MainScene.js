import InventoryPopUp from "./popup/InventoryPopUp.js";
import RankingPopUp from "./popup/RankingPopUp.js";
import AuctionPopUp from "./popup/AuctionPopUp.js"; // 1. AuctionPopUp을 import 합니다.

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
  }

  create() {
    // 무한 반복 배경: 현재 캔버스 크기에 맞춰 생성 (화면 꽉 채우기)
    // tileSprite는 텍스처를 반복 타일링하며 tilePosition 변경으로 무한 스크롤 효과 가능
    const { width: sw, height: sh } = this.scale;
    this.backgroundTile = this.add.tileSprite(
      sw / 2,
      sh / 2,
      sw,
      sh,
      "background"
    );

    // 윈도우 리사이즈 대응: 캔버스가 리사이즈되면 배경도 크기/위치 재조정
    // 주의: 이 콜백은 게임 config.scale.mode가 Phaser.Scale.RESIZE일 때 동작합니다.
    this.scale.on("resize", (gameSize) => {
      const { width, height } = gameSize;

      // 배경 재조정
      if (this.backgroundTile) {
        this.backgroundTile.setSize(width, height);
        this.backgroundTile.setPosition(width / 2, height / 2);
      }

      // 버튼 재배치 (정중앙 유지)
      if (this.buttons && this.buttons.length) {
        const cx = width / 2;
        const sp = 60;
        const by = height / 2 - ((this.buttons.length - 1) * sp) / 2;
        this.buttons.forEach((btn, i) => btn.setPosition(cx, by + sp * i));
      }
    });

    // 버튼 스타일 (반복 사용)
    const style = { fontSize: "38px", fill: "#ffffff" };
    const hoverStyle = { fill: "#ffdc6a" }; // 마우스 오버 스타일
    // 중앙 정렬 배치
    const centerX = sw / 2;
    const spacing = 60; // 버튼 간 간격
    const labels = ["▶ PLAY", "🏆 RANKING", "💰 AUCTION", "🎒 INVENTORY"];
    const baseY = sh / 2 - ((labels.length - 1) * spacing) / 2;

    const playBtn = this.add
      .text(centerX, baseY + spacing * 0, labels[0], style)
      .setOrigin(0.5)
      .setInteractive();
    playBtn.on("pointerdown", () => this.scene.start("PlayScene"));

    const rankBtn = this.add
      .text(centerX, baseY + spacing * 1, labels[1], style)
      .setOrigin(0.5)
      .setInteractive();
    rankBtn.on("pointerdown", () => {
      // TODO: 랭킹 기능 구현
      if (!this.rankingPopup || !this.rankingPopup.scene) {
        this.rankingPopup = new RankingPopUp(this, sw / 2, sh / 2);
      }
      this.rankingPopup.setVisible(true);
    });

    // ⭐️ 2. AuctionPopUp을 미리 생성하고 숨겨둡니다.
    this.auctionPopup = new AuctionPopUp(this, sw / 2, sh / 2);
    this.add.existing(this.auctionPopup);
    this.auctionPopup.setVisible(false);

    const auctionBtn = this.add
      .text(centerX, baseY + spacing * 2, labels[2], style)
      .setOrigin(0.5)
      .setInteractive();
    auctionBtn.on("pointerdown", () => {
      // ⭐️ 3. 버튼 클릭 시 팝업을 보여줍니다.
      this.auctionPopup.setVisible(true);
    });

    // ⭐️ "INVENTORY" 버튼에 팝업 기능을 연결합니다.
    const inventoryBtn = this.add
      .text(centerX, baseY + spacing * 3, labels[3], style)
      .setOrigin(0.5)
      .setInteractive();
    inventoryBtn.on("pointerdown", () => {
      // ⭐️ 정의되지 않은 width, height 대신 sw, sh를 사용합니다.
      if (!this.inventoryPopup || !this.inventoryPopup.scene) {
        this.inventoryPopup = new InventoryPopUp(this, sw / 2, sh / 2);
      }
      this.inventoryPopup.setVisible(true);
    });

    // 리사이즈 대응을 위한 버튼 배열 저장
    this.buttons = [playBtn, rankBtn, auctionBtn, inventoryBtn];

    // ⭐️ 1. 안전한 방식으로 각 버튼에 Hover 효과를 개별적으로 추가합니다.
    this.buttons.forEach((button) => {
      // 이 버튼들은 모두 Text 객체이므로 setStyle이 안전하게 동작합니다.
      button.on("pointerover", () => button.setStyle(hoverStyle));
      button.on("pointerout", () => button.setStyle(style));
    });

    // ❌ 2. 문제를 일으키는 전역 이벤트 리스너를 반드시 삭제하거나 주석 처리합니다.
    /*
    this.input.on("gameobjectover", (pointer, gameObject) => {
      gameObject.setStyle({ fill: "#ffdc6a" });
    });

    this.input.on("gameobjectout", (pointer, gameObject) => {
      gameObject.setStyle({ fill: "#ffffff" });
    });
    */
  }

  update(time, delta) {
    // 배경을 천천히 스크롤하여 무한 맵(무한 배경) 효과
    // 필요에 따라 속도/방향을 조절하세요.
    if (this.backgroundTile) {
      this.backgroundTile.tilePositionX += 0.3; // 오른쪽으로 천천히 이동
      // this.backgroundTile.tilePositionY += 0.1; // 위/아래 스크롤이 필요하면 사용
    }
  }
}
