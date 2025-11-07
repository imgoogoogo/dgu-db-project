export const Direction = Object.freeze({
  Up: "Up",
  Down: "Down",
  Left: "Left",
  Right: "Right",
});

export default class Player extends Phaser.Physics.Arcade.Sprite {
    static PLAYER_SPEED = 5;

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play("idle", true);
    }
    
    move(direction) {
        // setVelocity로 개선 해야함
        this.anims.play("walk", true);

        switch (direction) {
        case Direction.Up:
            this.y -= Player.PLAYER_SPEED;
            break;

        case Direction.Down:
            this.y += Player.PLAYER_SPEED;
            break;

        case Direction.Left:
            this.x -= Player.PLAYER_SPEED;
            this.flipX = true;
            break;

        case Direction.Right:
            this.x += Player.PLAYER_SPEED;
            this.flipX = false;
            break;
        }
    }

    stop() {
        // 현재 애니메이션이 walk일 때만 idle로 변경하여 불필요한 호출을 막습니다.
        if (this.anims.currentAnim.key === "walk") {
            this.anims.play("idle", true);
        }
    }
}