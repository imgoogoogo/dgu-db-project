export default class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, hp, atk, def, speed) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.speed = speed;

    this.anims.play(texture, true);
    this.body.setSize(40, 70);
    this.body.setOffset(44, 58);

    this.player = scene.player; // 씬의 플레이어 객체를 참조
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.move();
  }

  move() {
    if (!this.player || !this.player.active) {
      this.setVelocity(0, 0);
      return;
    }

    // 플레이어를 향해 이동
    this.scene.physics.moveToObject(this, this.player, this.speed);

    // 플레이어의 위치에 따라 몬스터의 방향을 결정합니다.
    if (this.x < this.player.x) this.flipX = false;
    else if (this.x > this.player.x) this.flipX = true;
  }
}
