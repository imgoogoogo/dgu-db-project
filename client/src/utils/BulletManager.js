import Bullet from "../effects/bullet.js";

export default class BulletManager {
    /**
     * @param {Phaser.Scene} scene 총알을 관리할 씬
     */
    constructor(scene) {
        this.scene = scene;

        // 총알 그룹을 생성하고 씬에 등록합니다.
        // PlayScene에서도 this.bullets로 접근할 수 있습니다.
        this.scene.bullets = this.scene.physics.add.group({
            classType: Bullet,
            runChildUpdate: true, // 그룹의 모든 자식의 update/preUpdate를 실행
            maxSize: -1 // ⭐️ 그룹의 최대 크기 제한을 해제합니다.
        });
    }

    /**
     * 설정된 시간 간격으로 총알 발사를 시작합니다.
     * @param {number} delay 총알 발사 간격 (밀리초)
     */
    startFiring(delay = 1000) {
        this.scene.time.addEvent({
            delay: delay,
            loop: true,
            callback: () => {
                    this.fireBullet();
            },
        });
    }

    fireBullet() {
        const player = this.scene.player;
        
        // 그룹에서 비활성화된 총알을 가져오거나, 없으면 새로 생성합니다.
        const bullet = this.scene.bullets.get(player.x, player.y, 'bullet');

        // bullet.fire() 메소드를 호출하여 발사를 시작합니다.
        if (bullet) {
            bullet.fire(player);
        }
    }

    deleteBullet(bullet) {
        bullet.setActive(false).setVisible(false).body.stop();
    }
}