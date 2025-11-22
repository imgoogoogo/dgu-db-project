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

    const critLevelText = this.scene.skillWindow.skillTexts[3]?.text;
    let critLevel = 0;
    if (critLevelText) {
      const match = critLevelText.match(/Lv\. (\d+)/);
      critLevel = match ? parseInt(match[1], 10) : 0;
    }

    const spread = 30;
    let startAngle = -spread / 2;
    let angleStep = count > 1 ? spread / (count - 1) : 0;
    const centerIndex = Math.floor(count / 2);

    // 몬스터 자동 조준 타겟 계산
    let target = null;
    if (critLevel > 0) {
      const monsters = this.monsterFactory.monsters
        .getChildren()
        .filter((m) => m.active);
      if (monsters.length > 0) {
        target = this.scene.physics.closest(player, monsters);
      }
    }

    // 정밀 사격 확률: 레벨당 20% (예시)
    const autoAimChance = Math.min(critLevel * 0.2, 1); // 최대 100%

    // spread 전체 방향(기준 각도) - 무작위 회전
    let randomBaseAngle = Phaser.Math.FloatBetween(-Math.PI, Math.PI);

    for (let i = 0; i < count; i++) {
      const bullet = this.bullets.get(player.x, player.y, "bullet");
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.enable = true;

        let angle;
        if (
          critLevel > 0 &&
          i === centerIndex &&
          target &&
          Math.random() < autoAimChance // ← 이 부분이 확률 적용
        ) {
          // 가운데 총알이 몬스터 방향
          const dx = target.x - player.x;
          const dy = target.y - player.y;
          angle = Math.atan2(dy, dx);
        } else {
          // 나머지 spread 각도는 무작위 기준 각도에서 퍼짐
          angle =
            randomBaseAngle + Phaser.Math.DegToRad(startAngle + i * angleStep);
        }

        const vx = Math.cos(angle) * Bullet.SPEED;
        const vy = Math.sin(angle) * Bullet.SPEED;
        bullet.setVelocity(vx, vy);

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
