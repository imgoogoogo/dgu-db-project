export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {}

  create() {
    const { width: sw, height: sh } = this.scale;

    // --- 흐린 검은색 오버레이 추가 ---
    const overlay = this.add.rectangle(sw / 2, sh / 2, sw, sh, 0x000000, 0.3);
    overlay.setDepth(1);

    // --- 배경 및 로고 ---
    this.backgroundTile = this.add.tileSprite(
      sw / 2,
      sh / 2,
      sw,
      sh,
      "background"
    );
    this.backgroundTile.setDepth(0);

    this.add
      .image(sw / 2, sh * 0.3, "logo")
      .setOrigin(0.5)
      .setScale(0.3)
      .setDepth(2);

    // --- 로그인 버튼 ---
    const loginBtn = this.add
      .image(sw / 2, sh * 0.7, "kakaologin_button")
      .setInteractive({ useHandCursor: true })
      .setDepth(3);

    // --- Main 메뉴 컨테이너(처음엔 숨김) ---
    const menuContainer = this.add.container(sw / 2, sh * 0.55);
    menuContainer.setDepth(2);
    menuContainer.setVisible(false);

    const baseScale = 0.3;

    // 플레이 버튼
    const playBtn = this.add
      .image(0, 0, "play_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    playBtn.on("pointerdown", () => this.scene.start("PlayScene"));
    menuContainer.add(playBtn);

    // 하단 버튼 위치 계산
    const smallButton = this.add
      .image(0, 0, "inventory_button")
      .setScale(baseScale)
      .setVisible(false);
    const smallButtonWidth = smallButton.displayWidth;
    smallButton.destroy();

    const horizontalGap = (playBtn.displayWidth - smallButtonWidth * 3) / 2;
    const spacing = smallButtonWidth + horizontalGap;
    const verticalGap = 1;
    const smallButtonY =
      playBtn.displayHeight / 2 + verticalGap + smallButtonWidth / 2;

    // 인벤토리, 랭킹, 거래소 버튼
    const inventoryBtn = this.add
      .image(-spacing, smallButtonY, "inventory_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    inventoryBtn.on("pointerdown", async () => {
      const iframe = document.getElementById("react-ui");
      iframe.src = "src/scenes/popup/InventoryScene.html";
      iframe.style.display = "block";
    });

    const rankingBtn = this.add
      .image(0, smallButtonY, "ranking_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    rankingBtn.on("pointerdown", () => {
      const iframe = document.getElementById("react-ui");
      iframe.src = "src/scenes/popup/RankingScene.html";
      iframe.style.display = "block";
    });

    const auctionBtn = this.add
      .image(spacing, smallButtonY, "auction_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    auctionBtn.on("pointerdown", () => {
      const iframe = document.getElementById("react-ui");
      iframe.src = "src/scenes/popup/AuctionScene.html";
      iframe.style.display = "block";
    });

    menuContainer.add([inventoryBtn, rankingBtn, auctionBtn]);

    // 호버 효과
    const allButtons = [playBtn, inventoryBtn, rankingBtn, auctionBtn];
    allButtons.forEach((button) => {
      button.on("pointerover", () => button.setScale(baseScale * 1.05));
      button.on("pointerout", () => button.setScale(baseScale));
    });

    // --- 로그인 버튼 클릭 시 메뉴 컨테이너 표시 ---
    loginBtn.on("pointerdown", () => {
      loginBtn.setVisible(false);
      menuContainer.setVisible(true);
    });

    // 리사이즈 대응
    this.scale.on("resize", (gameSize) => {
      const { width, height } = gameSize;
      if (this.backgroundTile) {
        this.backgroundTile
          .setSize(width, height)
          .setPosition(width / 2, height / 2);
      }
      overlay.setPosition(width / 2, height / 2).setSize(width, height);
      menuContainer.setPosition(width / 2, height * 0.55);
      loginBtn.setPosition(width / 2, height * 0.6);
    });
  }

  update(time, delta) {
    if (this.backgroundTile) {
      this.backgroundTile.tilePositionX += 0.3;
    }
  }
}
