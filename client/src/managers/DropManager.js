// DropManager.js
export default class DropManager {
  constructor(scene, gameData) {
    this.scene = scene;
    this.gameData = gameData;
  }

  handleMonsterDrop(monster) {
    // 드롭테이블에서 해당 몬스터의 드롭 아이템 목록 추출
    const drops = this.gameData.gameDataSet.drops.filter(
      (drop) => drop.monster_id === monster.monsterType
    );

    // 드롭 테이블 정보 없을 경우 처리 종료
    if (drops.length === 0) return;

    // 확률 기반 랜덤 드롭
    const totalChance = drops.reduce((sum, d) => sum + d.chance, 0);
    let rand = Math.random() * totalChance;
    let selectedDrop = drops[0];
    for (const drop of drops) {
      rand -= drop.chance;
      if (rand <= 0) {
        selectedDrop = drop;
        break;
      }
    }

    // 아이템을 안 주는 경우 (꽝)
    if (!selectedDrop || !selectedDrop.item_id) {
      return;
    }

    // 아이템 정보 찾기
    const item = this.gameData.gameDataSet.items.find(
      (it) => it.id === selectedDrop.item_id
    );
    if (!item) return;

    // 플레이어 인벤토리에 추가
    this.gameData.gameState.player.items.push(item);
    this.scene.chatManager.addMessage(
      `몬스터 처치! [${item.name}] 획득!`,
      "#00ff00ff"
    );
  }
}
