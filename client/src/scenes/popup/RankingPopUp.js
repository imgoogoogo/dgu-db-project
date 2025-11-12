export default class RankingPopUp extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    const panelWidth = 600;
    const panelHeight = 400;

    // 🔲 배경 패널
    const bg = scene.add.graphics();
    bg.fillStyle(0x14161c, 1);
    bg.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2,
      panelWidth,
      panelHeight,
      20
    );
    this.add(bg);

    // 📛 상단 타이틀 바
    const titleBg = scene.add.graphics();
    titleBg.fillStyle(0x1e2129, 1);
    titleBg.fillRoundedRect(
      -panelWidth / 2,
      -panelHeight / 2 - 40,
      panelWidth,
      50,
      { tl: 15, tr: 15, bl: 0, br: 0 }
    );
    this.add(titleBg);

    const titleText = scene.add.text(
      -panelWidth / 2 + 20,
      -panelHeight / 2 - 25,
      "🏆 랭킹",
      {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      }
    );
    this.add(titleText);

    // ❌ 닫기 버튼
    const closeBtn = scene.add.rectangle(
      panelWidth / 2 - 40,
      -panelHeight / 2 - 25,
      60,
      30,
      0x882222
    );
    closeBtn.setInteractive({ useHandCursor: true });
    const closeText = scene.add.text(
      panelWidth / 2 - 60,
      -panelHeight / 2 - 35,
      "닫기",
      {
        fontSize: "16px",
        color: "#ffffff",
      }
    );
    this.add(closeBtn);
    this.add(closeText);

    closeBtn.on("pointerdown", () => {
      this.setVisible(false);
    });

    // 🥇 랭킹 리스트 (예시 데이터)
    const rankings = [
      { rank: 1, name: "Player1", score: 1500 },
      { rank: 2, name: "Player2", score: 1200 },
      { rank: 3, name: "Player3", score: 1000 },
      { rank: 4, name: "Player4", score: 800 },
      { rank: 5, name: "Player5", score: 600 },
    ];

    rankings.forEach((entry, index) => {
      const entryText = scene.add.text(
        -panelWidth / 2 + 40,
        -panelHeight / 2 + 60 + index * 40,
        `${entry.rank}. ${entry.name} - ${entry.score}점`,
        {
          fontSize: "18px",
          color: "#ffffff",
        }
      );
      this.add(entryText);
    });
    scene.add.existing(this);
  }
}
