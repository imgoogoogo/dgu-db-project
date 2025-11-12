export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 200;
  static LIFESPAN = 2000; // 밀리초

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire() {
    const closestMonster = this.scene.physics.closest(
      this,
      this.scene.monsterManager.monsters.getChildren().filter((m) => m.active)
    );

    if (closestMonster) {
      this.scene.physics.moveToObject(this, closestMonster, Bullet.SPEED);
    } else {
      this.setVelocity(0, -Bullet.SPEED);
    }

    this.lifespanTimer = this.scene.time.delayedCall(Bullet.LIFESPAN, () => {
      this.setActive(false).setVisible(false).body.stop();
    });
  }
}
