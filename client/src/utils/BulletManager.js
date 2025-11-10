import Bullet from "../effects/bullet.js";
import StageManager from "./GameManager.js";

export default class BulletManager {
  constructor(scene) {
    this.scene = scene;

    this.scene.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true, // 그룹의 모든 자식의 update/preUpdate를 실행
      maxSize: -1, // ⭐️ 그룹의 최대 크기 제한을 해제합니다.
    });

    this.startEvent(1000); // 0.5초 간격으로 총알 발사 시작
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

  fireBullet() {
    const player = this.scene.player;
    const bullet = this.scene.bullets.get(player.x, player.y, "bullet"); // 텍스처는 그룹에 설정되어 있다면 생략 가능

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.enable = true;
      bullet.fire();
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
}
