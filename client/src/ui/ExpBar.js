export default class ExpBar extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y) {
    super(scene, { x, y });

    // 경험치 바의 크기 및 위치 설정
    this.barWidth = scene.cameras.main.width;
    this.barHeight = 15;
    this.x = x;
    this.y = y;

    // UI 표시에 사용될 데이터 (초기값)
    this.maxExp = 100;
    this.displayExp = 0; // 애니메이션을 위한 '보여주기용' 값

    this.setScrollFactor(0);
    scene.add.existing(this);

    // 레벨 텍스트 생성
    this.levelText = scene.add
      .text(this.barWidth - 10, this.y + this.barHeight + 5, `Lv. 1`, {
        fontFamily: "Arial",
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);

    this.draw(); // 초기 바 그리기
  }

  /**
   * 외부(GameManager)로부터 받은 데이터로 경험치 바와 레벨 텍스트를 업데이트합니다.
   * @param {number} currentExp - 표시할 현재 경험치
   * @param {number} maxExp - 현재 레벨의 최대 경험치
   * @param {number} level - 표시할 현재 레벨
   */
  updateUI(currentExp, maxExp, level) {
    this.maxExp = maxExp;
    this.levelText.setText(`Lv. ${level}`);

    // 기존 애니메이션이 있다면 중지하고 새로 시작합니다.
    if (this.expTween) {
      this.expTween.stop();
    }

    // displayExp 값을 실제 currentExp 값까지 부드럽게 변화시키는 Tween 애니메이션
    this.expTween = this.scene.tweens.add({
      targets: this, // 애니메이션 대상은 ExpBar 자기 자신
      displayExp: currentExp, // 목표 값
      duration: 300, // 0.3초 동안 애니메이션
      ease: "Power1", // 부드러운 시작과 끝을 위한 Easing 함수
      onUpdate: () => this.draw(), // 애니메이션 매 프레임마다 draw() 함수 호출
    });
  }

  /**
   * 경험치 바를 화면에 그립니다.
   */
  draw() {
    this.clear();

    // 1. 배경 바 (검은색)
    this.fillStyle(0x000000, 0.8);
    this.fillRect(this.x, this.y, this.barWidth, this.barHeight);

    // 2. 차오르는 경험치 바 (0x00BBFE)
    // displayExp 값을 기준으로 너비를 계산합니다.
    const expRatio = this.displayExp / this.maxExp;
    const fillWidth = this.barWidth * expRatio;

    this.fillStyle(0x00bbfe, 1);
    this.fillRect(this.x, this.y, fillWidth, this.barHeight);
  }
}
