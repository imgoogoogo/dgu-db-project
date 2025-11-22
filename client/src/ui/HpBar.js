export default class HpBar extends Phaser.GameObjects.Container {
  constructor(scene, pos_x, pos_y, maxHp) {
    super(scene, pos_x, pos_y);

    this.maxHp = maxHp;
    this.currentHp = this.maxHp;

    this.setScrollFactor(0); // UI 요소가 카메라 스크롤에 영향을 받지 않도록 설정
    this.scene.add.existing(this);
    this.draw();
  }

  draw() {
    // icon
    const icon = this.scene.add
      .image(0, 0, "icon_heart")
      .setOrigin(0, 0.5)
      .setScale(0.8);
    this.add(icon);

    // background bar
    this.bgBar = this.scene.add
      .rectangle(icon.displayWidth + 10, 0, 200, 25, 0x333333)
      .setOrigin(0, 0.5);
    this.add(this.bgBar);

    // hp bar
    this.hpBar = this.scene.add
      .rectangle(icon.displayWidth + 10, 0, 200, 25, 0xff0000)
      .setOrigin(0, 0.5);
    this.add(this.hpBar);

    // hp 텍스트
    this.hpText = this.scene.add
      .text(icon.displayWidth + 120, 0, `${this.currentHp} / ${this.maxHp}`, {
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    this.add(this.hpText);
  }

  updateUI(newHp) {
    this.currentHp = Phaser.Math.Clamp(newHp, 0, this.maxHp);
    const hpRatio = this.currentHp / this.maxHp;
    this.hpBar.width = 200 * hpRatio;
    if (this.hpText) {
      this.hpText.setText(`${this.currentHp} / ${this.maxHp}`);
    }
  }
}
