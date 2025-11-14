export default class RankingScene extends Phaser.Scene {
  constructor() {
    super("RankingScene");
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // 배경색
    this.cameras.main.setBackgroundColor("#1A1D2E");

    /* ---------------------------------------------------------
     * TOP BAR
     * --------------------------------------------------------- */
    const topBar = this.add.graphics();
    topBar.fillStyle(0x252838, 1);
    topBar.fillRect(0, 0, W, 89);
    topBar.lineStyle(1, 0xffffff, 0.1);
    topBar.strokeRect(0, 0, W, 89);

    // 아이콘 박스
    const iconBg = this.add.graphics();
    iconBg.fillStyle(0xa855f7, 1);
    iconBg.fillRoundedRect(32, 28, 32, 32, 4);
    this.add.text(40, 31, "🏆", {
      fontFamily: "Inter",
      fontSize: "20px",
      color: "#FFFFFF",
    });

    // 랭킹 텍스트
    this.add.text(78, 33, "랭킹", {
      fontSize: "20px",
      color: "#FFFFFF",
    });

    // 닫기 버튼
    const closeBtn = this.add.graphics();
    closeBtn.fillGradientStyle(0xdc4444, 0xb83636, 0xb83636, 0xdc4444, 1);
    closeBtn.fillRoundedRect(W - 120, 25, 90, 40, 10);

    this.add
      .text(W - 93, 33, "닫기", {
        fontSize: "16px",
        color: "#FFFFFF",
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
      });

    /* ---------------------------------------------------------
     * MY RANK BOX
     * --------------------------------------------------------- */
    const containerY = 89;
    const containerPad = 24;

    const box = this.add.graphics();
    box.fillStyle(0x252838, 1);
    box.lineStyle(1, 0xffffff, 0.1);
    box.strokeRoundedRect(24, containerY + 24, W - 48, 106, 16);
    box.fillRoundedRect(24, containerY + 24, W - 48, 106, 16);

    const MY_Y = containerY + 24 + 25;

    // 내 랭킹 & CurrentPlayer
    this.add.text(50, MY_Y, "내 랭킹", {
      fontSize: "14px",
      color: "#999999",
    });
    this.add.text(50, MY_Y + 25, "CurrentPlayer", {
      fontSize: "20px",
      color: "#FFFFFF",
    });

    // 오른쪽 3개 정보
    const rightX = W - 350;
    const stats = [
      { label: "순위", value: "#42", color: "#FFB347" },
      { label: "최고 스테이지", value: "32", color: "#FFB347" },
      { label: "플레이 타임", value: "5h 23m", color: "#4EA8DE" },
    ];

    let sx = rightX;
    stats.forEach((s) => {
      this.add.text(sx, MY_Y, s.label, {
        fontSize: "14px",
        color: "#999999",
      });
      this.add.text(sx, MY_Y + 25, s.value, {
        fontSize: "24px",
        color: s.color,
      });
      sx += 110;
    });

    /* ---------------------------------------------------------
     * TAB + SEARCH
     * --------------------------------------------------------- */
    // 전체 + 주간 랭킹 (왼쪽)
    const tabY = MY_Y + 110;

    // 전체 랭킹 버튼
    const tabAll = this.add.graphics();
    tabAll.fillGradientStyle(0xa855f7, 0x7c3aed, 0x7c3aed, 0xa855f7, 1);
    tabAll.fillRoundedRect(24, tabY, 108, 50, 10);

    this.add.text(24 + 26, tabY + 13, "전체 랭킹", {
      fontSize: "16px",
      color: "#0A0A0A",
    });

    // 주간 랭킹 버튼(비활성)
    const tabWeek = this.add.graphics();
    tabWeek.fillStyle(0xffffff, 0.05);
    tabWeek.lineStyle(1, 0xffffff, 0.1);
    tabWeek.strokeRoundedRect(24 + 124, tabY, 110, 50, 10);
    tabWeek.fillRoundedRect(24 + 124, tabY, 110, 50, 10);

    this.add.text(24 + 124 + 26, tabY + 13, "주간 랭킹", {
      fontSize: "16px",
      color: "#999999",
    });

    /* 검색창 */
    const searchX = W - 24 - 320;
    const searchY = tabY;

    const searchBox = this.add.graphics();
    searchBox.fillStyle(0xffffff, 0.05);
    searchBox.lineStyle(1, 0xffffff, 0.1);
    searchBox.strokeRoundedRect(searchX, searchY, 320, 50, 10);
    searchBox.fillRoundedRect(searchX, searchY, 320, 50, 10);

    this.add.text(searchX + 48, searchY + 15, "닉네임 검색...", {
      fontSize: "16px",
      color: "rgba(255,255,255,0.5)",
    });

    this.add.text(searchX + 16, searchY + 13, "🔍", {
      fontSize: "20px",
      color: "#999999",
    });

    /* ---------------------------------------------------------
     * TABLE HEADER
     * --------------------------------------------------------- */
    const tableY = searchY + 70;

    const tableHeader = this.add.graphics();
    tableHeader.fillStyle(0xffffff, 0.05);
    tableHeader.lineStyle(1, 0xffffff, 0.1);
    tableHeader.strokeRect(24, tableY, W - 48, 53);
    tableHeader.fillRect(24, tableY, W - 48, 53);

    this.add.text(48, tableY + 16, "Rank", {
      fontSize: "14px",
      color: "#999999",
    });
    this.add.text(144, tableY + 16, "Player", {
      fontSize: "14px",
      color: "#999999",
    });
    this.add.text(W - 350, tableY + 16, "Max Stage", {
      fontSize: "14px",
      color: "#999999",
    });
    this.add.text(W - 180, tableY + 16, "Play Time", {
      fontSize: "14px",
      color: "#999999",
    });

    /* ---------------------------------------------------------
     * RANK LIST (STATIC)
     * --------------------------------------------------------- */
    const rankingData = [
      {
        rank: 1,
        name: "ZombieSlayer",
        stage: 87,
        time: "4h 2m",
        color: "#FFD700",
      },
      {
        rank: 2,
        name: "SurvivalKing",
        stage: 76,
        time: "3h 34m",
        color: "#C0C0C0",
      },
      {
        rank: 3,
        name: "DeadHunter",
        stage: 71,
        time: "3h 7m",
        color: "#CD7F32",
      },
      { rank: 4, name: "NightWalker", stage: 65, time: "2h 44m", color: null },
      { rank: 5, name: "Warrior2024", stage: 58, time: "2h 24m", color: null },
      { rank: 6, name: "FastRunner", stage: 52, time: "2h 0m", color: null },
      { rank: 7, name: "BraveSoul", stage: 48, time: "1h 49m", color: null },
      { rank: 8, name: "GhostKiller", stage: 45, time: "1h 39m", color: null },
    ];

    let rowY = tableY + 53;

    rankingData.forEach((player) => {
      const row = this.add.graphics();
      row.lineStyle(1, 0xffffff, 0.05);
      row.strokeRect(24, rowY, W - 48, 73);

      // rank number box
      const rankBg = this.add.graphics();
      rankBg.fillStyle(0xffffff, player.color ? 0.2 : 0.05);
      rankBg.fillRoundedRect(24 + 24, rowY + 16, 40, 40, 10);

      this.add.text(24 + 24 + 13, rowY + 21, player.rank.toString(), {
        fontSize: player.color ? "18px" : "18px",
        color: player.color || "#999999",
      });

      // name
      this.add.text(144, rowY + 24, player.name, {
        fontSize: "16px",
        color: "#ffffff",
      });

      // stage
      this.add.text(W - 350, rowY + 24, player.stage.toString(), {
        fontSize: "16px",
        color: "#FFB347",
      });

      // time
      this.add.text(W - 180, rowY + 24, player.time, {
        fontSize: "16px",
        color: "#4EA8DE",
      });

      rowY += 73;
    });
  }
}
