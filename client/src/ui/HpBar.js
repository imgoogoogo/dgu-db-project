export default class HpBar extends Phaser.GameObjects.Graphics {
  /**
   * @param {Phaser.Scene} scene 씬
   * @param {number} x x 좌표
   * @param {number} y y 좌표
   * @param {number} width 너비
   * @param {number} height 높이
   */
  constructor(scene, x, y, width = 40, height = 5) {
    super(scene);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = 100; // 0 ~ 100 사이의 값

    // 씬의 화면 목록에 추가하여 보이게 합니다.
    scene.add.existing(this);

    this.draw();
  }

  /**
   * HP 바의 값을 설정하고 다시 그립니다.
   * @param {number} newValue 0에서 100 사이의 새로운 HP 값 (백분율)
   */
  setValue(newValue) {
    this.value = Phaser.Math.Clamp(newValue, 0, 100);
    this.draw();
  }

  /**
   * HP 바를 화면에 그립니다.
   */
  draw() {
    this.clear();

    // 1. 배경 (어두운 회색)
    this.fillStyle(0x333333);
    this.fillRect(0, 0, this.width, this.height);

    // 2. HP (항상 빨간색으로 설정)
    this.fillStyle(0xff0000); // ⭐️ 항상 빨간색으로 표시하도록 수정

    // 3. 현재 HP만큼 채우기
    const healthWidth = Math.floor(this.width * (this.value / 100));
    this.fillRect(0, 0, healthWidth, this.height);
  }

  /**
   * HP 바의 위치를 업데이트합니다. (캐릭터의 update에서 호출)
   * @param {number} x 새로운 x 좌표
   * @param {number} y 새로운 y 좌표
   */
  updatePosition(x, y) {
    this.setPosition(x, y);
  }
}
