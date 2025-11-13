export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "coin"); // 'coin' 텍스처 키
    this.value = 10; // 코인의 가치
    this.type = "coin"; // 아이템 매니저에서 인식할 타입
  }

  spawn() {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    // TODO: 생성 시 통통 튀는 애니메이션 추가 가능
    this.anims.play("coin", true);
  }
}
