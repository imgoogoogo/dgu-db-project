// DropManager.js
export default class DropManager {
  constructor(scene, gameData) {
    this.scene = scene;
    this.gameData = gameData;
  }

  handleMonsterDrop(monster) {
    const item = this.getRandomItem();

    this.scene.chatManager.addMessage(
      `몬스터 처치! [${item.name}] 획득!`,
      "#00ff00ff"
    );
  }

  getRandomItem() {
    const items = this.gameData.gameDataSet.items;
    const total = items.reduce((sum, it) => sum + it.chance, 0);

    let rand = Math.random() * total;
    for (const item of items) {
      rand -= item.chance;
      if (rand <= 0) return item;
    }
    return items[0];
  }
}
