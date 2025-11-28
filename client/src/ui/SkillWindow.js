export default class SkillWindow extends Phaser.GameObjects.Container {
  constructor(scene, x, y, skillCounts = [0, 0, 0, 0, 0]) {
    super(scene, x, y);
    this.setDepth(100); // 다른 UI 요소들보다 위에 표시되도록 깊이 설정
    this.setScrollFactor(0);
    scene.add.existing(this);

    const icons = ["🔫", "💉", "⚡", "🎯", "💥"];
    const boxSize = 40;
    const gap = 10;
    const totalWidth = icons.length * boxSize + (icons.length - 1) * gap;
    const startX = 0;

    this.skillTexts = [];

    for (let i = 0; i < icons.length; i++) {
      const posX = startX + i * (boxSize + gap);

      // 네모상자
      const box = scene.add
        .rectangle(posX, 0, boxSize, boxSize, 0x222222)
        .setOrigin(0, 0.5)
        .setStrokeStyle(2, 0xffffff);
      this.add(box);

      // 이모티콘 (박스 중앙에 오도록)
      const emoji = scene.add
        .text(posX + boxSize / 2, -8, icons[i], {
          fontFamily: "Arial",
          fontSize: "18px",
          align: "center",
        })
        .setOrigin(0.5, 0.5);
      this.add(emoji);

      // 숫자 (박스 아래 중앙, 박스 안쪽에 오도록 y값 조정)
      const countText = scene.add
        .text(posX + boxSize / 2, boxSize / 2 - 8, `Lv. ${skillCounts[i]}`, {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#fff",
          align: "center",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0.5);
      this.add(countText);

      this.skillTexts.push(countText);
    }
  }

  updateSkillCounts(skillCounts) {
    if (!this.skillTexts) return;
    for (let i = 0; i < this.skillTexts.length; i++) {
      this.skillTexts[i].setText(`${skillCounts[i]}`);
    }
  }

  increaseSkillLevel(skillIndex) {
    if (skillIndex < 0 || skillIndex >= this.skillTexts.length) return;
    // 현재 레벨 추출 (예: "Lv. 3" → 3)
    const currentText = this.skillTexts[skillIndex].text;
    const match = currentText.match(/Lv\. (\d+)/);
    let currentLevel = match ? parseInt(match[1], 10) : 0;
    currentLevel += 1;
    this.skillTexts[skillIndex].setText(`Lv. ${currentLevel}`);
  }
}
