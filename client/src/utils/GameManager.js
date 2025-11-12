import GameData from "../data/GameData.js";
import DataManager from "../utils/DataManager.js";

export default class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.gameData = new GameData();
    this.gameData.reset();

    // 첫 스테이지를 시작합니다.
    this.initStage(1);
  }

  // 스테이지를 설정하는 메소드
  initStage(stage) {
    this.gameData.setStage(stage);
    this.scene.monsterManager.stopEvent();
    this.scene.monsterManager.startEvent(1000); // 1초 간격

    // UI 업데이트
    this.updateAllUI();
  }

  // 플레이어가 몬스터와 충돌했을 때 호출될 메소드
  onMonsterHitPlayer(player, monster) {
    // 플레이어 체력 감소
    this.gameData.takeDamage(0.1);
    this.updateAllUI();
    if (this.gameData.getPlayerHp() <= 0) {
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
    this.gameData.incrementMonsterKilled();
    this.updateAllUI();

    // 목표 처치 수를 달성했는지 확인합니다.
    if (
      this.gameData.getMonsterKilledCount() >=
      this.gameData.getMonsterPerStage()
    )
      this.initStage(this.gameData.getStage() + 1);
  }

  // 플레이어가 아이템을 획득했을 때 호출될 메소드
  onPlayerGetItem(player, item) {
    let itemType = this.scene.itemManager.onPlayerCollect(player, item);
    this.scene.itemManager.removeItem(item);

    console.log(`획득한 아이템 종류: ${itemType}`);
    // 경험치 바에 경험치를 추가합니다.
    if (itemType === "diamond") this.gameData.addExp(10);
    else if (itemType === "coin") this.gameData.addGold(5);

    this.updateAllUI();
  }

  updateAllUI() {
    this.scene.stage.updateUI(this.gameData.getStage());
    this.scene.remainMonster.updateUI(
      this.gameData.getMonsterPerStage() - this.gameData.getMonsterKilledCount()
    );
    this.scene.gold.updateUI(this.gameData.getGold());
    this.scene.expBar.updateUI(
      this.gameData.getCurrentExp(),
      this.gameData.getExpNeededLevel(),
      this.gameData.getPlayerLevel()
    );
    this.scene.player.hpBar.setValue(this.gameData.getPlayerHp());
  }

  async saveGameResult() {
    const gameResult = {
      stage: 5,
      killCount: 120,
      playTime: 180,
      items: [], // 획득한 아이템 정보
      goldEarned: 250,
    };
    try {
      await DataManager.saveGameResult(gameResult);
      console.log("게임 결과가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("게임 결과 저장 실패:", error);
    }
  }
}
