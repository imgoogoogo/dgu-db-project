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
  }

  /* ───────────────────────────────────────
   * 플레이어 피격
   * ─────────────────────────────────────── */
  onMonsterHitPlayer(player, monster) {
    const amount = monster.atk;
    this.damagePlayer(amount);
  }

  damagePlayer(amount) {
    this.gameData.addState("player.currentHp", -amount);

    this.playerHitEffect();

    if (this.gameData.getState("player.currentHp") <= 0) {
      this.scene.gameManager.showGameOver();
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
      onComplete: () => player.clearTint(),
    });
  }

  /* ───────────────────────────────────────
   * 총알이 몬스터에게 적중
   * ─────────────────────────────────────── */
  onBulletHitMonster(bullet, monster) {
    const atk = this.gameData.getState("player.currentAtk");
    const def = monster.def;

    const damage = Math.floor(atk * (100 / (100 + def)));

    this.damagePopupManager.showDamage(monster.x, monster.y, damage);

    monster.hp -= damage;

    if (monster.hp > 0) {
      this.knockbackMonster(bullet, monster);
      this.bulletFactory.removeBullet(bullet);
      return;
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
