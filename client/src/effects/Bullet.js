export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    static SPEED = 100;
    static LIFESPAN = 1000; // 밀리초

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // 생성 시에는 비활성화 상태로 시작합니다.
        this.setActive(false);
        this.setVisible(false);
        this.scale = 0.5;
    }

    /**
     * 총알을 발사하는 메소드
     * @param {Player} player 총알을 발사하는 플레이어
     */
    fire(player) {
        // 1. 총알을 활성화하고 화면에 보이게 합니다.
        this.setActive(true);
        this.setVisible(true);

        // 2. ⭐️ setPosition 대신 body.reset()을 사용합니다.
        // 이것은 위치를 설정하는 동시에, 물리 바디의 모든 상태(속도, 정지 등)를
        // 깨끗하게 초기화하여 재활용 시 발생하는 문제를 완벽하게 해결합니다.
        this.body.reset(player.x, player.y);

        // 3. 가장 가까운 몬스터를 찾아 날아갑니다.
        const closestMonster = this.scene.physics.closest(this, this.scene.monsters.getChildren().filter(m => m.active));

        if (closestMonster) {
            this.scene.physics.moveToObject(this, closestMonster, Bullet.SPEED);
        } else {
            this.setVelocity(0, -Bullet.SPEED);
        }

        // 4. 일정 시간 후 비활성화
        // 비활성화는 간단하게 setActive(false)만 호출해도 충분합니다.
        // Phaser가 나머지를 자동으로 처리해 줍니다.
        this.scene.time.delayedCall(Bullet.LIFESPAN, () => {
            this.setActive(false);
        });
    }
}