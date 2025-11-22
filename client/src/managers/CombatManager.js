// CombatManager.js
export default class CombatManager {
  constructor(scene, gameData, gameManager) {
    this.scene = scene;
    this.gameData = gameData;
    this.dropManager = gameManager.dropManager;
    this.damagePopupManager = gameManager.damagePopupManager;
    this.bulletFactory = gameManager.bulletFactory;
    this.monsterFactory = gameManager.monsterFactory;
    this.itemFactory = gameManager.itemFactory;
    this.gameManager = gameManager;
    this.isDamaging = false;
  }

  /* ───────────────────────────────────────
   * 플레이어 피격
   * ─────────────────────────────────────── */
  onMonsterHitPlayer(player, monster) {
    if (this.isDamaging) return;
    this.isDamaging = true;

    const atk = monster.atk;
    const def = this.gameData.getState("player.currentDef");
    const damage = Math.floor(atk * (100 / (100 + def)));

    this.damagePlayer(damage);
  }

  damagePlayer(amount) {
    this.gameData.addState("player.currentHp", -amount);

    // Update HP bar UI
    this.scene.player.hpBar.setValue(
      (this.gameData.getState("player.currentHp") /
        this.gameData.getState("player.maxHp")) *
        100
    );
    this.scene.hpBar.updateUI(this.gameData.getState("player.currentHp"));

    this.playerHitEffect();

    if (this.gameData.getState("player.currentHp") <= 0) {
      this.bulletFactory.stopEvent();

      this.scene.player.die();
      this.scene.player.once("animationcomplete-dead", () => {
        setTimeout(() => {
          this.scene.scene.pause();
          this.scene.gameManager.showGameOver();
        }, 1000); // 1초(1000ms) 뒤에 실행
      });
    }
  }

  playerHitEffect() {
    // Flash red effect
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
        player.alpha = 1;
        this.isDamaging = false;
      },
    });
  }

  /* ───────────────────────────────────────
   * 총알이 몬스터에게 적중
   * ─────────────────────────────────────── */
  onBulletHitMonster(bullet, monster) {
    const atk = this.gameData.getState("player.currentAtk");
    const def = monster.def;
    const damage = Math.floor(atk * (100 / (100 + def)));

    // 💥 타격강화 레벨에 따라 타격 횟수 증가
    const areaLevelText = this.scene.skillWindow.skillTexts[4]?.text; // 💥 인덱스 4
    let areaLevel = 0;
    if (areaLevelText) {
      const match = areaLevelText.match(/Lv\. (\d+)/);
      areaLevel = match ? parseInt(match[1], 10) : 0;
    }
    const hitCount = 1 + areaLevel; // 기본 1회 + 강화 레벨만큼 추가 타격

    // showDamage 여러 번 호출
    for (let i = 0; i < hitCount; i++) {
      setTimeout(() => {
        this.damagePopupManager.showDamage(monster.x, monster.y, damage);
      }, i * 200); // 200ms 간격으로 표시 (원하는 값으로 조절)
    }

    monster.hp -= damage * hitCount;

    if (monster.hp > 0) {
      this.knockbackMonster(bullet, monster);
      this.bulletFactory.removeBullet(bullet);
      return;
    }

    // 생명력 흡수 효과 적용
    const lifeStealLevelText = this.scene.skillWindow.skillTexts[1]?.text; // 💉 인덱스 1
    let lifeStealLevel = 0;
    if (lifeStealLevelText) {
      const match = lifeStealLevelText.match(/Lv\. (\d+)/);
      lifeStealLevel = match ? parseInt(match[1], 10) : 0;
    }
    if (lifeStealLevel > 0) {
      // 예시: 레벨당 5% 흡혈
      const healAmount = Math.floor(
        damage * hitCount * (0.05 * lifeStealLevel)
      );
      if (healAmount > 0) {
        const curHp = this.gameData.getState("player.currentHp");
        const maxHp = this.gameData.getState("player.maxHp");
        const newHp = Math.min(curHp + healAmount, maxHp);
        this.gameData.setState("player.currentHp", newHp);
        this.scene.hpBar.updateUI(newHp);
      }
    }

    this.killMonster(monster);
    this.bulletFactory.removeBullet(bullet);
  }

  knockbackMonster(bullet, monster) {
    const power = 200;
    const dx = monster.x - bullet.x;
    const dy = monster.y - bullet.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    monster.applyKnockback((dx / len) * power, (dy / len) * power, 200);
  }

  killMonster(monster) {
    this.monsterFactory.removeMonster(monster);
    this.itemFactory.createItem(monster.x, monster.y);

    this.gameData.addState("monster.killedInStage", 1);
    this.gameData.addState("monster.killedAll", 1);

    this.dropManager.handleMonsterDrop(monster);

    this.gameManager.checkStageClear();
  }
}
