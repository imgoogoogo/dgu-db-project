export default class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.stage = 1;
    this.monstersToKill = 0;
    this.monstersKilled = 0;

    // 플레이어 몬스터 충돌 처리
    this.scene.physics.add.overlap(
      this.scene.player,
      this.scene.monsters,
      this.onMonsterHitPlayer,
      null,
      this
    );

    // 총알 몬스터 충돌 처리
    this.scene.physics.add.overlap(
      this.scene.bullets,
      this.scene.monsters,
      this.onBulletHitMonster,
      null,
      this
    );

    // 첫 스테이지를 시작합니다.
    this.setupStage(this.stage);
  }

  onMonsterHitPlayer(player, monster) {
    console.log("플레이어가 몬스터와 충돌!");
  }

  onBulletHitMonster(bullet, monster) {
    console.log("총알이 몬스터와 충돌!");
    this.scene.bulletManager.removeBullet(bullet);
    this.scene.monsterManager.removeMonster(monster);
    this.onMonsterDefeated();
  }

  // 스테이지를 설정하는 메소드
  setupStage(stage) {
    this.stage = stage;
    this.monstersKilled = 0;

    // 스테이지별로 처치할 몬스터 수와 스폰 속도를 설정합니다.
    switch (stage) {
      case 1:
        this.monstersToKill = 10; // 예시: 1스테이지는 10마리
        this.scene.monsterManager.startEvent(1000); // 1초 간격
        break;
      case 2:
        this.monstersToKill = 20; // 예시: 2스테이지는 20마리
        this.scene.monsterManager.startEvent(800); // 0.8초 간격으로 더 빠르게
        break;
      case 3:
        this.monstersToKill = 30;
        this.scene.monsterManager.startEvent(500); // 0.5초 간격으로 매우 빠르게
        break;
      default:
        // 마지막 스테이지 이후의 처리 (예: 무한 모드)
        this.monstersToKill = 9999;
        this.scene.monsterManager.startEvent(300);
        break;
    }

    // UI를 업데이트합니다.
    //this.scene.stage.updateText(this.stage);
    this.updateMonsterCountUI();
  }

  // 몬스터가 처치될 때마다 호출될 메소드
  onMonsterDefeated() {
    this.monstersKilled++;
    this.updateMonsterCountUI();

    // 목표 처치 수를 달성했는지 확인합니다.
    if (this.monstersKilled >= this.monstersToKill) {
      this.nextStage();
    }
  }

  // 다음 스테이지로 진행하는 메소드
  nextStage() {
    // 현재 몬스터 스폰 이벤트를 중지합니다.
    this.scene.monsterManager.stopEvent();

    // TODO: 스테이지 클리어 보상 (예: 플레이어 레벨업, 아이템 선택 등)
    console.log(`스테이지 ${this.stage} 클리어!`);
    this.setupStage(this.stage + 1);
  }

  // 몬스터 카운트 UI를 업데이트하는 헬퍼 메소드
  updateMonsterCountUI() {
    const remaining = this.monstersToKill - this.monstersKilled;
    this.scene.countMonster.updateCount(remaining);
  }
}
