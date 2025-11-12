export default class Stage extends Phaser.GameObjects.Text {
  constructor(scene, x, y) {
    super(scene, x, y, "Stage 1", {
      fontSize: "24px",
      fill: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
    });
    // ⭐️ 텍스트의 정중앙을 기준으로 위치를 잡도록 Origin을 수정하는 것이 좋습니다.
    this.setOrigin(0.5, 0);
    this.setScrollFactor(0); // 카메라가 움직여도 UI가 화면에 고정되도록 설정
    scene.add.existing(this);
  }

  /**
   * 스테이지 텍스트를 업데이트합니다.
   * @param {number} stageNumber - 표시할 현재 스테이지 번호
   */
  updateUI(stageNumber) {
    this.setText(`Stage ${stageNumber}`);
  }
}
