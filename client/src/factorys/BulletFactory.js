import Bullet from "../effects/bullet.js";

export default class BulletFactory {
  constructor(scene, monsterFactory) {
    this.scene = scene;
    this.monsterFactory = monsterFactory;

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true, // 그룹의 모든 자식의 update/preUpdate를 실행
      maxSize: -1, // ⭐️ 그룹의 최대 크기 제한을 해제합니다.
    });

    this.startEvent(1000); // 0.5초 간격으로 총알 발사 시작
  }

  fireBullet() {
    const player = this.scene.player;
    const count = player.bulletCount || 1;

    // 총알 각도 분산 (예: -15도 ~ +15도)
    const spread = 30; // 전체 퍼짐 각도
    const startAngle = -spread / 2;
    const angleStep = count > 1 ? spread / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const bullet = this.bullets.get(player.x, player.y, "bullet");
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.enable = true;

        // 각도 계산
        const angle = Phaser.Math.DegToRad(startAngle + i * angleStep);

        // 타겟이 있으면 타겟 방향, 없으면 spread 적용
        const closestMonster = this.scene.physics.closest(
          bullet,
          this.monsterFactory.monsters.getChildren().filter((m) => m.active)
        );

        if (closestMonster) {
          // 기본 방향 벡터
          const dx = closestMonster.x - player.x;
          const dy = closestMonster.y - player.y;
          const baseAngle = Math.atan2(dy, dx);

          // 퍼짐 각도 적용
          const finalAngle = baseAngle + angle;
          const vx = Math.cos(finalAngle) * Bullet.SPEED;
          const vy = Math.sin(finalAngle) * Bullet.SPEED;
          bullet.setVelocity(vx, vy);
        } else {
          // 위쪽으로 spread
          const vx = Math.sin(angle) * Bullet.SPEED;
          const vy = -Math.cos(angle) * Bullet.SPEED;
          bullet.setVelocity(vx, vy);
        }

        bullet.lifespanTimer = this.scene.time.delayedCall(
          Bullet.LIFESPAN,
          () => {
            bullet.setActive(false).setVisible(false).body.stop();
          }
        );
      }
    }
  }

  removeBullet(bullet) {
    if (bullet.lifespanTimer) {
      bullet.lifespanTimer.remove();
      bullet.lifespanTimer = null; // 참조를 제거하여 메모리 누수를 방지합니다.
    }
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.enable = false;
  }

  startEvent(delay = 1000) {
    this.fireEvent = this.scene.time.addEvent({
      delay: delay,
      loop: true,
      callback: () => {
        this.fireBullet();
      },
    });
  }

  stopEvent() {
    if (this.fireEvent) {
      this.fireEvent.remove();
      this.fireEvent = null; // 참조를 제거합니다.
    }
  }
}
