export default class Monster extends Phaser.Physics.Arcade.Sprite {
    static MONSTER_SPEED = 50;
    
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play("monster", true);
        this.body.setSize(40, 70);
        this.body.setOffset(44, 58);

        this.player = scene.player; // 씬의 플레이어 객체를 참조
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.handleMovement();
    }

    handleMovement() {
        if (!this.player || !this.player.active) {
            this.setVelocity(0, 0);
            return;
        }
        
        // 플레이어를 향해 이동
        this.scene.physics.moveToObject(this, this.player, Monster.MONSTER_SPEED);

        // 플레이어의 위치에 따라 몬스터의 방향을 결정합니다.
        if (this.x < this.player.x) this.flipX = false; 
        else if (this.x > this.player.x) this.flipX = true;
    }
}