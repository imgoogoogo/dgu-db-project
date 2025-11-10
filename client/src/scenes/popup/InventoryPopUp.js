export default class InventoryPopUp extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    const panelWidth = 1000;
    const panelHeight = 600;

    // 🔲 배경 패널
    const bg = scene.add.graphics();
    bg.fillStyle(0x14161c, 1);
    bg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 20);
    this.add(bg);

    // 📛 상단 타이틀 바
    const titleBg = scene.add.graphics();
    titleBg.fillStyle(0x1e2129, 1);
    titleBg.fillRoundedRect(-panelWidth / 2, -panelHeight / 2 - 40, panelWidth, 50, { tl: 15, tr: 15, bl: 0, br: 0 });
    this.add(titleBg);

    const titleText = scene.add.text(-panelWidth / 2 + 20, -panelHeight / 2 - 25, "📦 인벤토리", {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: "Arial",
    });
    this.add(titleText);

    // ❌ 닫기 버튼
    const closeBtn = scene.add.rectangle(panelWidth / 2 - 40, -panelHeight / 2 - 25, 60, 30, 0x882222);
    closeBtn.setInteractive({ useHandCursor: true });
    const closeText = scene.add.text(panelWidth / 2 - 60, -panelHeight / 2 - 35, "닫기", {
      fontSize: "16px",
      color: "#ffffff",
    });
    this.add(closeBtn);
    this.add(closeText);

    closeBtn.on("pointerdown", () => {
      this.setVisible(false);
    });

    // 🧍 왼쪽 패널 (플레이어 정보)
    const leftPanel = scene.add.graphics();
    leftPanel.fillStyle(0x181b23, 1);
    leftPanel.fillRoundedRect(-panelWidth / 2 + 20, -panelHeight / 2 + 20, 300, panelHeight - 40, 15);
    this.add(leftPanel);

    // 💰 골드
    const goldText = scene.add.text(-panelWidth / 2 + 40, -panelHeight / 2 + 40, "플레이어   💰 7,874", {
      fontSize: "18px",
      color: "#f9b84c",
    });
    this.add(goldText);

    // ❤️ 체력 / ⚔ 공격력
    const stats = [
      { label: "총 체력", value: "100 (+10)", icon: "❤️" },
      { label: "총 공격력", value: "100 (+10)", icon: "⚔️" },
    ];

    stats.forEach((s, i) => {
      const y = -panelHeight / 2 + 100 + i * 40;
      this.add(scene.add.text(-panelWidth / 2 + 50, y, `${s.icon} ${s.label}`, { fontSize: "16px", color: "#ffffff" }));
      this.add(scene.add.text(-panelWidth / 2 + 220, y, s.value, { fontSize: "16px", color: "#a0a0a0" }));
    });

    // 🧩 "착용 중" 구역
    const equipLabel = scene.add.text(-panelWidth / 2 + 40, -panelHeight / 2 + 200, "착용 중", {
      fontSize: "16px",
      color: "#bbbbbb",
    });
    this.add(equipLabel);

    const equipBox = scene.add.graphics();
    equipBox.fillStyle(0x5cb85c, 1);
    equipBox.fillRoundedRect(-panelWidth / 2 + 40, -panelHeight / 2 + 230, 260, 50, 10);
    this.add(equipBox);

    // 📦 오른쪽 인벤토리 목록
    const rightPanel = scene.add.graphics();
    rightPanel.fillStyle(0x181b23, 1);
    rightPanel.fillRoundedRect(-panelWidth / 2 + 340, -panelHeight / 2 + 20, panelWidth - 360, panelHeight - 40, 15);
    this.add(rightPanel);

    // 상단 탭 버튼 (전체 / 무기 / 상의 / 하의)
    const tabs = ["전체", "무기", "상의", "하의"];
    tabs.forEach((tab, i) => {
      const tabText = scene.add.text(-panelWidth / 2 + 380 + i * 80, -panelHeight / 2 + 40, tab, {
        fontSize: "18px",
        color: "#ffffff",
      });
      tabText.setInteractive({ useHandCursor: true });
      tabText.on("pointerdown", () => console.log(`${tab} 탭 클릭됨`));
      this.add(tabText);
    });

    scene.add.existing(this);
  }
}
