import DataManager from "../utils/DataManager.js";
import SkillPopup from "../scenes/popup/SkillPopup.js";

export default class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.gameData = this.scene.gameData;

    // 첫 스테이지 시작
    this.initStage(1);
  }

  /* =========================================================
   *  STAGE 관리
   * ======================================================= */

  initStage(stage) {
    this.gameData.setState("stage.current", stage);
    this.gameData.setState("monster.killedInStage", 0);

    this.resetSpawnEvent(stage);
    this.updateAllUI();

    this.scene.chatManager.addMessage(
      `=== 스테이지 ${stage} 시작 ===`,
      "#ffff00ff"
    );
  }

  resetSpawnEvent(stage) {
    const spawnDelay =
      this.gameData.getConfig("stage.initialSpawnDelay") -
      (stage - 1) * this.gameData.getConfig("stage.spawnDelayDecreaseFlat");

    this.scene.monsterManager.stopEvent();
    this.scene.monsterManager.startEvent(spawnDelay);
  }

  checkStageClear() {
    const killed = this.gameData.getState("monster.killedInStage");
    const need = this.gameData.getMonsterPerStage();

    if (killed >= need) {
      this.initStage(this.gameData.getState("stage.current") + 1);
    }
  }

  /* =========================================================
   *  PLAYER 피격
   * ======================================================= */

  onMonsterHitPlayer(player, monster) {
    const monsterAtk = monster.atk;
    this.damagePlayer(monsterAtk);
  }

  damagePlayer(amount) {
    this.gameData.addState("player.currentHp", -amount);

    this.playerHitEffect();
    this.updateAllUI();

    if (this.gameData.getState("player.currentHp") <= 0) {
      this.showGameOver();
    }
  }

  playerHitEffect() {
    const player = this.scene.player;

    player.setTint(0xff0000);
    this.scene.tweens.add({
      targets: player,
      alpha: { from: 0.5, to: 1 },
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        player.clearTint();
        player.setAlpha(1);
      },
    });
  }

  /* =========================================================
   *  BULLET → MONSTER 데미지
   * ======================================================= */

  onBulletHitMonster(bullet, monster) {
    const atk = parseInt(this.gameData.getState("player.currentAtk"));
    const def = parseInt(monster.def);

    const damage = Math.floor(atk * (100 / (100 + def)));

    this.scene.DamagePopupManager.showDamage(monster.x, monster.y, damage);

    monster.hp -= damage;

    if (monster.hp > 0) {
      this.knockbackMonster(bullet, monster);
      this.scene.bulletManager.removeBullet(bullet);
      return;
    }

    this.killMonster(monster);
    this.scene.bulletManager.removeBullet(bullet);
    this.updateAllUI();
  }

  knockbackMonster(bullet, monster) {
    const knockbackPower = 200;
    const dx = monster.x - bullet.x;
    const dy = monster.y - bullet.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    monster.applyKnockback(
      (dx / len) * knockbackPower,
      (dy / len) * knockbackPower,
      200
    );
  }

  killMonster(monster) {
    this.scene.monsterManager.removeMonster(monster);
    this.scene.itemManager.createItem(monster.x, monster.y);

    this.gameData.addState("monster.killedInStage", 1);

    this.handleMonsterDrop(monster);
    this.checkStageClear();
  }

  /* =========================================================
   *  MONSTER DROP 처리
   * ======================================================= */

  handleMonsterDrop(monster) {
    const drop = this.getRandomItem();

    this.scene.chatManager.addMessage(
      `몬스터를 처치하고 [${drop.name}]을 획득했습니다!`,
      "#00ff00ff"
    );
  }

  getRandomItem() {
    const items = this.scene.gameData.gameDataSet.items;
    const totalChance = items.reduce((sum, item) => sum + item.chance, 0);

    const rand = Math.random() * totalChance;
    let acc = 0;

    for (const item of items) {
      acc += item.chance;
      if (rand <= acc) return item;
    }

    return items[0];
  }

  /* =========================================================
   *  ITEM 획득
   * ======================================================= */

  onPlayerGetItem(player, item) {
    const type = this.scene.itemManager.onPlayerCollect(player, item);
    this.scene.itemManager.removeItem(item);

    if (type === "diamond") this.handleExpGain(20);
    else if (type === "coin") this.handleGoldGain(5);

    this.updateAllUI();
  }

  handleExpGain(amount) {
    this.gameData.addState("player.currentExp", amount);
    this.checkLevelUp();
  }

  handleGoldGain(amount) {
    this.gameData.addState("player.gold", amount);
  }

  /* =========================================================
   *  LEVEL UP + SKILL 선택
   * ======================================================= */

  checkLevelUp() {
    const exp = this.gameData.getState("player.currentExp");
    const need = this.gameData.getExpNeededLevel();

    if (exp >= need) {
      this.gameData.addState("player.level", 1);
      this.gameData.setState("player.currentExp", 0);

      this.showSkillPopup();
    }
  }

  showSkillPopup() {
    this.scene.scene.pause("PlayScene");
    this.scene.scene.launch("PopupScene");

    // new SkillPopup(this.scene, skills, (selectedSkill) => {
    //   this.applySkill(selectedSkill);
    //   this.scene.scene.resume("PlayScene");
    //   this.updateAllUI();
    // });
  }

  applySkill(skill) {
    if (skill.includes("공격력")) {
      this.gameData.addState("player.currentAtk", 10);
    }
    if (skill.includes("방어력")) {
      this.gameData.addState("player.currentDef", 10);
    }
    if (skill.includes("이동속도")) {
      this.scene.player.speed *= 1.2;
    }
  }

  /* =========================================================
   *  GAME OVER 처리
   * ======================================================= */

  showGameOver() {
    this.scene.scene.pause("PlayScene");

    this.gameData.gameResult.stage = this.gameData.getState("stage.current");
    this.gameData.gameResult.survivalTime =
      this.gameData.getState("system.clock");
    this.gameData.gameResult.kills =
      this.gameData.getState("monster.killedAll");
    this.gameData.gameResult.goldEarned = this.gameData.getState("player.gold");
    this.gameData.gameResult.rewards = this.gameData.getState("player.items");

    const iframe = document.getElementById("react-ui");
    iframe.style.visibility = "hidden";
    iframe.src = "src/scenes/popup/GameResult.html";

    console.log("게임 결과 데이터:", this.gameData.gameResult);

    const handleReady = (event) => {
      if (event.data === "GAME_RESULT_READY") {
        iframe.contentWindow.postMessage(
          {
            type: "GAME_RESULT_DATA",
            payload: this.gameData.gameResult,
          },
          "*"
        );
      }
      if (event.data === "GAME_RESULT_RENDER_COMPLETE") {
        window.removeEventListener("message", handleReady);
        iframe.style.visibility = "visible";
      }
    };

    window.addEventListener("message", handleReady);
    window.addEventListener("message", (event) => {
      if (event.data?.type === "GO_TO_MAIN") {
        // 씬 전환
        this.scene.scene.start("MainScene");
        window.removeEventListener("message", this);
      } else if (event.data?.type === "RESTART_GAME") {
        this.scene.scene.start("PlayScene");
        window.removeEventListener("message", this);
      }
    });
  }

  /* =========================================================
   *  UI 업데이트
   * ======================================================= */

  updateAllUI() {
    this.scene.stage.updateUI(this.gameData.getState("stage.current"));
    this.scene.remainMonster.updateUI(
      this.gameData.getMonsterPerStage() -
        this.gameData.getState("monster.killedInStage")
    );
    this.scene.gold.updateUI(this.gameData.getState("player.gold"));
    this.scene.expBar.updateUI(
      this.gameData.getState("player.currentExp"),
      this.gameData.getExpNeededLevel(),
      this.gameData.getState("player.level")
    );
    this.scene.player.hpBar.setValue(
      this.gameData.getState("player.currentHp")
    );
  }

  /* =========================================================
   *  게임 결과 저장
   * ======================================================= */

  async saveGameResult() {
    const gameResult = {
      stage: 5,
      killCount: 120,
      playTime: 180,
      items: [],
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
