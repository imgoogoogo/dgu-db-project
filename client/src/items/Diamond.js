export default class Diamond extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "diamond"); // 'diamond' 텍스처 키
    this.value = 50; // 다이아몬드의 가치 (경험치)
    this.type = "diamond"; // 아이템 매니저에서 인식할 타입
  }

  spawn() {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    // TODO: 생성 시 반짝이는 애니메이션 추가 가능
    this.anims.play("diamond", true);
  }
}
