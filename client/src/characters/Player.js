import DataManager from "../utils/DataManager.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 초기 애니메이션 및 물리 속성 설정
    this.anims.play("idle", true);
    this.body.setSize(40, 70);
    this.body.setOffset(44, 58);

    // camera가 플레이어를 따라오도록 설정
    scene.cameras.main.startFollow(this, true, 0.1, 0.1);

    // keyboard input 설정
    this.keyboardInput = this.scene.input.keyboard.createCursorKeys();
    this.wasdKeys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // player 속성 설정
    this.hp = DataManager.playerState.hp;
    this.speed = DataManager.playerState.speed;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.move();
  }

  move() {
    const speed = this.speed;
    let velocityX = 0;
    let velocityY = 0;
    let isMoving = false;

    // 수평 이동 입력
    if (this.keyboardInput.left.isDown || this.wasdKeys.left.isDown) {
      velocityX = -speed;
      this.flipX = true; // 즉시 방향 전환
      isMoving = true;
    } else if (this.keyboardInput.right.isDown || this.wasdKeys.right.isDown) {
      velocityX = speed;
      this.flipX = false; // 즉시 방향 전환
      isMoving = true;
    }

    // 수직 이동 입력
    if (this.keyboardInput.up.isDown || this.wasdKeys.up.isDown) {
      velocityY = -speed;
      isMoving = true;
    } else if (this.keyboardInput.down.isDown || this.wasdKeys.down.isDown) {
      velocityY = speed;
      isMoving = true;
    }

    // 속도 설정
    this.setVelocity(velocityX, velocityY);

    // 대각선 이동 시 속도가 빨라지지 않도록 정규화(normalize)합니다.
    if (velocityX !== 0 && velocityY !== 0) {
      this.body.velocity.normalize().scale(speed);
    }

    // 키 입력 여부를 기준으로 애니메이션을 결정
    if (isMoving) {
      this.anims.play("walk", true);
    } else {
      this.anims.play("idle", true);
    }
  }
}
