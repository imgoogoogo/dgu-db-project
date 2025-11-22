// DropManager.js
export default class DropManager {
  constructor(scene, gameData) {
    this.scene = scene;
    this.gameData = gameData;
  }

  handleMonsterDrop(monster) {
    // 몬스터의 drop_item 코드에 해당하는 아이템만 추출
    const items = this.gameData.gameDataSet.items.filter(
      (it) => it.code === monster.drop_item
    );
    if (items.length === 0) return;

    // 해당 아이템의 chance만큼 확률적 드랍
    const item = this.getRandomItem(items);

    this.scene.chatManager.addMessage(
      `몬스터 처치! [${item.name}] 획득!`,
      "#00ff00ff"
    );
  }

  getRandomItem(items) {
    const total = items.reduce((sum, it) => sum + it.chance, 0);

    let rand = Math.random() * total;
    for (const item of items) {
      rand -= item.chance;
      if (rand <= 0) return item;
    }
    return items[0];
  }
}
