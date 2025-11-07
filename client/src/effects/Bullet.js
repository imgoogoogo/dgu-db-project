export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 500; // 총알 속도
        this.lifespan = 1000; // 총알 수명 (밀리초)
        this.birthTime = 0; // 생성 시간 기록
    }

    fire(x, y, angle) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.birthTime = this.scene.time.now;

        // 각도에 따라 속도 설정
        this.scene.physics.velocityFromAngle(angle, this.speed, this.body.velocity);
    }

    update(time, delta) {
        // 수명이 다 된 총알 비활성화
        if (time - this.birthTime > this.lifespan) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}