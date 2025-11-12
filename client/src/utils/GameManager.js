export default class GameManager {
  static CURRENT_STAGE; // 현재 스테이지

  // hp
  static PLAYER_MAX_HP = 100; // 플레이어 최대 체력
  static PLAYER_CURRENT_HP = 100; // 플레이어 현재 체력

  // monster
  static MONSTER_PER_STAGE; // 스테이지 당 몬스터 수
  static MONSTER_KILLED_COUNT; // 처치한 몬스터 수

  // exp
  static PLAYER_LEVEL; // 플레이어 레벨
  static CURRENT_EXP = 0; // 현재 경험치
  static EXP_NEEDED_LEVEL = 100; // 레벨업에 필요한 경험치

  // clock
  static CLOCK; // 게임 내 시간

  // gold
  static GOLD; // 플레이어가 가진 골드

  constructor(scene) {
    this.scene = scene;

    // 초기 값 설정
    GameManager.PLAYER_LEVEL = 1;
    GameManager.CURRENT_EXP = 0;
    GameManager.EXP_NEEDED_LEVEL = 100;
    GameManager.CLOCK = 0;
    GameManager.GOLD = 0;

    // 첫 스테이지를 시작합니다.
    this.setupStage(1);
  }

  // 스테이지를 설정하는 메소드
  setupStage(stage) {
    this.scene.monsterManager.stopEvent();

    GameManager.CURRENT_STAGE = stage;
    GameManager.MONSTER_PER_STAGE = stage * 10; // 예: 2스테이지는 20마리
    GameManager.MONSTER_KILLED_COUNT = 0; // ⭐️ 잡은 몬스터 수 초기화

    this.scene.monsterManager.startEvent(1000); // 1초 간격

    // UI 업데이트
    this.updateAllUI();
  }

  // 플레이어가 몬스터와 충돌했을 때 호출될 메소드
  onMonsterHitPlayer(player, monster) {
    console.log("플레이어가 몬스터와 충돌!");

    // 플레이어 체력 감소
    GameManager.PLAYER_CURRENT_HP -= 0.1;
    this.updateAllUI();
    if (GameManager.PLAYER_CURRENT_HP < 0) {
      // 게임 스탑
      // this.scene.scene.pause("PlayScene");
      this.scene.scene.start("MainScene");
      console.log("게임 오버!");
      // 게임 결과 화면 표시
    }
  }

  // 총알이 몬스터와 충돌했을 때 호출될 메소드
  onBulletHitMonster(bullet, monster) {
    // 충돌한 총알과 몬스터를 비활성화합니다.
    this.scene.bulletManager.removeBullet(bullet);
    this.scene.monsterManager.removeMonster(monster);

    // ⭐️ 몬스터가 죽은 위치에 아이템 드롭을 요청합니다.
    this.scene.itemManager.createItem(monster.x, monster.y);

    // 몬스터 처치 카운트를 증가시킵니다.
    GameManager.MONSTER_KILLED_COUNT++;
    this.updateAllUI();

    // 목표 처치 수를 달성했는지 확인합니다.
    if (GameManager.MONSTER_KILLED_COUNT >= GameManager.MONSTER_PER_STAGE)
      this.setupStage(GameManager.CURRENT_STAGE + 1);
  }

  // 플레이어가 아이템을 획득했을 때 호출될 메소드
  onPlayerGetItem(player, item) {
    let itemType = this.scene.itemManager.onPlayerCollect(player, item);
    this.scene.itemManager.removeItem(item);

    console.log(`획득한 아이템 종류: ${itemType}`);
    // 경험치 바에 경험치를 추가합니다.
    if (itemType === "diamond") GameManager.CURRENT_EXP += 10;
    else if (itemType === "coin") GameManager.GOLD += 5;
    this.updateAllUI();

    // 레벨업 체크
    if (GameManager.CURRENT_EXP >= GameManager.EXP_NEEDED_LEVEL) {
      this.onPlayerLevelUp();
    }
  }

  onPlayerLevelUp() {
    GameManager.PLAYER_LEVEL++;
    GameManager.CURRENT_EXP -= GameManager.EXP_NEEDED_LEVEL;
    console.log(`레벨업! 현재 레벨: ${GameManager.PLAYER_LEVEL}`);

    // 레벨업 후 경험치 바를 0으로 초기화
    GameManager.CURRENT_EXP = 0;
    this.updateAllUI();
  }

  updateAllUI() {
    this.scene.stage.updateUI(GameManager.CURRENT_STAGE);
    this.scene.remainMonster.updateUI(
      GameManager.MONSTER_PER_STAGE - GameManager.MONSTER_KILLED_COUNT
    );
    this.scene.gold.updateUI(GameManager.GOLD);
    this.scene.expBar.updateUI(
      GameManager.CURRENT_EXP,
      GameManager.EXP_NEEDED_LEVEL,
      GameManager.PLAYER_LEVEL
    );
    this.scene.player.hpBar.setValue(GameManager.PLAYER_CURRENT_HP);
  }
}
