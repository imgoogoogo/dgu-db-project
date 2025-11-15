export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {}

  create() {
    const { width: sw, height: sh } = this.scale;
    const iframe = document.getElementById("react-ui");

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
    inventoryBtn.on("pointerdown", () => {
      // 더미 인벤토리 데이터
      const inventoryData = {
        myGold: 1500,
        playerStats: {
          totalAtk: 135,
          totalDef: 95,
          totalHp: 250,
        },
        inventoryItems: [
          {
            id: 1,
            name: "화염의 검",
            type: "weapon",
            hp: 50,
            atk: 65,
            def: 20,
            equipped: false,
            desc: "불꽃으로 적을 불태우는 전설의 검",
          },
          {
            id: 2,
            name: "모자",
            type: "hat",
            atk: 65,
            hp: 50,
            equipped: false,
            desc: "불꽃으로 적을 불태우는 전설의 검",
          },
        ],
      };

      // TODO: 로딩 화면 구현
      const loader = document.getElementById("phaser-loader");
      loader.style.visibility = "visible";

      iframe.style.visibility = "hidden";
      iframe.src = "src/scenes/popup/InventoryScene.html";

      // iframe에서 READY 메시지를 기다림
      const handleReady = (event) => {
        if (event.data === "INVENTORY_READY") {
          iframe.contentWindow.postMessage(
            { type: "INVENTORY_DATA", payload: inventoryData },
            "*"
          );
        }
        if (event.data === "INVENTORY_RENDER_COMPLETE") {
          window.removeEventListener("message", handleReady);
          loader.style.visibility = "hidden";
          iframe.style.visibility = "visible";
        }
      };

      window.addEventListener("message", handleReady);
    });

    const rankingBtn = this.add
      .image(0, smallButtonY, "ranking_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    rankingBtn.on("pointerdown", () => {
      // 더미 랭킹 데이터
      const rankingData = {
        myRanking: {
          rank: 12,
          nickName: "PlayerOne",
          maxStage: 45,
          playTime: 5234,
          lastPlayed: "2024-06-10T19:50:00",
        },
        rankings: [
          {
            rank: 1,
            nickName: "ZombieSlayer",
            maxStage: 87,
            playTime: 14523,
            lastPlayed: "2025-11-16T14:23:00",
          },
          {
            rank: 2,
            nickName: "SurvivalKing",
            maxStage: 76,
            playTime: 12845,
            lastPlayed: "2025-11-14T18:47:00",
          },
          {
            rank: 3,
            nickName: "DeadHunter",
            maxStage: 71,
            playTime: 11234,
            lastPlayed: "2025-11-09T20:15:00",
          },
          {
            rank: 4,
            nickName: "NightWalker",
            maxStage: 65,
            playTime: 9876,
            lastPlayed: "2025-11-08T22:05:00",
          },
          {
            rank: 5,
            nickName: "Warrior2024",
            maxStage: 58,
            playTime: 8654,
            lastPlayed: "2025-11-07T16:30:00",
          },
          {
            rank: 6,
            nickName: "FastRunner",
            maxStage: 52,
            playTime: 7234,
            lastPlayed: "2024-06-10T19:50:00",
          },
          {
            rank: 7,
            nickName: "BraveSoul",
            maxStage: 48,
            playTime: 6543,
            lastPlayed: "2024-06-09T21:10:00",
          },
          {
            rank: 8,
            nickName: "GhostKil2ler",
            maxStage: 45,
            playTime: 5987,
            lastPlayed: "2024-06-08T20:00:00",
          },
        ],
      };

      // TODO: 로딩 화면 구현
      const loader = document.getElementById("phaser-loader");
      loader.style.visibility = "visible";

      iframe.style.visibility = "hidden";
      iframe.src = "src/scenes/popup/RankingScene.html";

      // iframe에서 READY 메시지를 기다림
      const handleReady = (event) => {
        if (event.data === "RANKING_READY") {
          iframe.contentWindow.postMessage(
            { type: "RANKING_DATA", payload: rankingData },
            "*"
          );
        }
        if (event.data === "RANKING_RENDER_COMPLETE") {
          window.removeEventListener("message", handleReady);
          loader.style.visibility = "hidden";
          iframe.style.visibility = "visible";
        }
      };

      window.addEventListener("message", handleReady);
    });

    const auctionBtn = this.add
      .image(spacing, smallButtonY, "auction_button")
      .setInteractive({ useHandCursor: true })
      .setScale(baseScale);
    auctionBtn.on("pointerdown", () => {
      // 더미 경매장 데이터
      const auctionData = {
        myGold: 1000,
        auctionItems: [
          {
            id: 1,
            name: "번개 반지",
            type: "weapon",
            hp: 10,
            atk: 20,
            def: 30,
            seller: "고영민",
            time: "2024-06-09T21:10:00",
            price: 3253,
          },
        ],
        mySales: [
          {
            id: 2,
            name: "번개 반지",
            type: "weapon",
            hp: 10,
            atk: 20,
            def: 30,
            seller: "고영민",
            time: "2024-06-09T21:10:00",
            price: 3253,
          },
        ],
      };

      // TODO: 로딩 화면 구현
      const loader = document.getElementById("phaser-loader");
      loader.style.visibility = "visible";

      iframe.style.visibility = "hidden";
      iframe.src = "src/scenes/popup/AuctionScene.html";

      // iframe에서 READY 메시지를 기다림
      const handleReady = (event) => {
        if (event.data === "AUCTION_READY") {
          iframe.contentWindow.postMessage(
            { type: "AUCTION_DATA", payload: auctionData },
            "*"
          );
        }
        if (event.data === "AUCTION_RENDER_COMPLETE") {
          window.removeEventListener("message", handleReady);
          loader.style.visibility = "hidden";
          iframe.style.visibility = "visible";
        }
      };

      window.addEventListener("message", handleReady);
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
