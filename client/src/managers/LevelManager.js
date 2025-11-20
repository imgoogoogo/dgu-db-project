// LevelManager.js
export default class LevelManager {
  constructor(scene, gameData) {
    this.scene = scene;
    this.gameData = gameData;
  }

  gainExp(amount) {
    this.gameData.addState("player.currentExp", amount);
    this.checkLevelUp();
  }

  checkLevelUp() {
    const exp = this.gameData.getState("player.currentExp");
    const need = this.gameData.getExpNeededLevel();

    if (exp < need) return;

    this.gameData.addState("player.level", 1);
    this.gameData.setState("player.currentExp", 0);

    this.showSkillPopup();
  }

  showSkillPopup() {
    this.scene.scene.pause("PlayScene");
    this.scene.scene.launch("PopupScene");
  }
}
