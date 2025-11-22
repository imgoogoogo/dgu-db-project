// GameManager.js
import CombatManager from "./CombatManager.js";
import LevelManager from "./LevelManager.js";
import DropManager from "./DropManager.js";
import DamagePopupManager from "./DamagePopupManager.js";
import MonsterFactory from "../factorys/MonsterFactory.js";
import BulletFactory from "../factorys/BulletFactory.js";
import ItemFactory from "../factorys/ItemFactory.js";
import dataManager from "../managers/DataManager.js";

export default class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.gameData = scene.gameData;

    this.monsterFactory = new MonsterFactory(this.scene);
    this.bulletFactory = new BulletFactory(this.scene, this.monsterFactory);
    this.itemFactory = new ItemFactory(this.scene);
    this.damagePopupManager = new DamagePopupManager(this.scene);
    this.dropManager = new DropManager(this.scene, this.gameData);
    this.levelManager = new LevelManager(this.scene, this.gameData);
    this.combatManager = new CombatManager(this.scene, this.gameData, this);

    this.initStage(1);
    this.bindCollisions();
  }

  /* ─────────────────────────────
   * 몬스터 / 플레이어 충돌 처리
   * ───────────────────────────── */
  bindCollisions() {
    const s = this.scene;
    const c = this.combatManager;

    s.physics.add.overlap(
      s.player,
      this.monsterFactory.monsters,
      c.onMonsterHitPlayer,
      null,
      c
    );

    s.physics.add.overlap(
      this.bulletFactory.bullets,
      this.monsterFactory.monsters,
      c.onBulletHitMonster,
      null,
      c
    );

    s.physics.add.overlap(
      s.player,
      this.itemFactory.coins,
      this.onPlayerGetItem,
      null,
      this
    );

    s.physics.add.overlap(
      s.player,
      this.itemFactory.diamonds,
      this.onPlayerGetItem,
      null,
      this
    );
  }

  /* ─────────────────────────────
   * 스테이지 관리
   * ───────────────────────────── */
  initStage(stage) {
    this.gameData.setState("stage.current", stage);
    this.gameData.setState("monster.killedInStage", 0);

    this.resetSpawnEvent(stage);
    this.updateAllUI();

    this.scene.chatManager.addMessage(
      `=== 스테이지 ${stage} 시작 ===`,
      "#ffff00ff",
      2000
    );
  }

  resetSpawnEvent(stage) {
    const delay =
      this.gameData.getConfig("stage.baseSpawnDelay") -
      (stage - 1) * this.gameData.getConfig("stage.spawnDelayDecreasePerStage");

    this.monsterFactory.stopEvent();
    this.monsterFactory.startEvent(delay);
  }

  checkStageClear() {
    const killed = this.gameData.getState("monster.killedInStage");
    const need = this.gameData.getMonsterPerStage();
    this.updateAllUI();

    if (killed >= need) {
      this.initStage(this.gameData.getState("stage.current") + 1);
    }
  }

  /* ─────────────────────────────
   * 아이템 획득 처리
   * ───────────────────────────── */
  onPlayerGetItem(player, item) {
    const type = this.itemFactory.onPlayerCollect(player, item);
    this.itemFactory.removeItem(item);

    if (type === "diamond") this.levelManager.gainExp(20);
    else if (type === "coin") this.gameData.addState("player.gold", 5);

    this.updateAllUI();
  }

  /* ─────────────────────────────
   * 게임 오버
   * ───────────────────────────── */
  async showGameOver() {
    this.scene.scene.pause("PlayScene");

    const result = this.gameData.gameResult;
    result.stage = this.gameData.getState("stage.current");
    result.survivalTime = this.scene.clock.getElapsedTime();
    result.kills = this.gameData.getState("monster.killedAll");
    result.goldEarned = this.gameData.getState("player.gold");
    result.rewards = this.gameData.getState("player.items");

    await dataManager.saveGameResult(result);

    const iframe = document.getElementById("react-ui");
    iframe.style.visibility = "hidden";
    iframe.src = "src/scenes/popup/GameResult.html";

    const handler = (event) => {
      if (event.data === "GAME_RESULT_READY") {
        iframe.contentWindow.postMessage(
          { type: "GAME_RESULT_DATA", payload: result },
          "*"
        );
      }
      if (event.data === "GAME_RESULT_RENDER_COMPLETE") {
        window.removeEventListener("message", handler);
        iframe.style.visibility = "visible";
      }
    };
    window.addEventListener("message", handler);

    window.addEventListener("message", (event) => {
      if (event.data?.type === "GO_TO_MAIN") {
        this.scene.scene.start("MainScene");
        window.removeEventListener("message", this);
      } else if (event.data?.type === "RESTART_GAME") {
        this.scene.scene.start("PlayScene");
        window.removeEventListener("message", this);
      }
    });
  }

  /* ─────────────────────────────
   * UI 업데이트
   * ───────────────────────────── */
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
  }
}
