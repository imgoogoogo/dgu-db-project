export default class DamagePopupManager {
  constructor(scene) {
    this.scene = scene;
  }

  showDamage(x, y, damage, color = "#ff4444", fontSize = 20) {
    // 데미지 텍스트 생성
    const text = this.scene.add
      .text(x, y, damage.toString(), {
        fontSize: `${fontSize}px`,
        color: color,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setDepth(9999)
      .setOrigin(0.5);

    // 살짝 랜덤 오프셋 (자연스럽게)
    const offsetX = Phaser.Math.Between(-10, 10);
    const offsetY = Phaser.Math.Between(-10, 10);

    // 떠오르는 애니메이션
    this.scene.tweens.add({
      targets: text,
      x: x + offsetX,
      y: y - 40 + offsetY,
      alpha: 0,
      duration: 1000,
      ease: "Cubic.easeOut",
      onComplete: () => {
        text.destroy();
      },
    });
  }
}
