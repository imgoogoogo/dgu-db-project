import Coin from "../items/Coin.js";
import Diamond from "../items/Diamond.js";

export default class ItemManager {
  constructor(scene) {
    this.scene = scene;

    // 코인과 다이아몬드를 위한 별도의 물리 그룹을 생성합니다.
    // 이를 통해 오브젝트 풀링(재사용)이 가능해집니다.
    this.coins = this.scene.physics.add.group({
      classType: Coin,
      runChildUpdate: true,
    });
    this.diamonds = this.scene.physics.add.group({
      classType: Diamond,
      runChildUpdate: true,
    });

    // 플레이어와 아이템의 충돌 처리를 PlayScene에서 설정할 수 있도록
    // 콜백 메소드의 컨텍스트를 현재 인스턴스에 고정합니다.
    this.onPlayerCollect = this.onPlayerCollect.bind(this);
  }

  /**
   * 지정된 위치에 아이템을 드롭합니다.
   * 몬스터가 죽었을 때 GameManager에 의해 호출됩니다.
   * @param {number} x - 드롭할 x 좌표
   * @param {number} y - 드롭할 y 좌표
   */
  createItem(x, y) {
    // 10% 확률로 다이아몬드(경험치), 90% 확률로 코인(골드)을 드롭합니다.
    const dropChance = Math.random();
    if (dropChance < 0.9) {
      // 다이아몬드 드롭
      const diamond = this.diamonds.get(x, y, "diamond"); // 'diamond'는 텍스처 키
      if (diamond) {
        diamond.spawn();
      }
    } else {
      // 코인 드롭
      const coin = this.coins.get(x, y, "coin"); // 'coin'은 텍스처 키
      if (coin) {
        coin.spawn();
      }
    }
  }

  /**
   * 아이템을 그룹에서 비활성화합니다.
   * @param {Coin|Diamond} item
   */
  removeItem(item) {
    if (item instanceof Coin) {
      this.coins.killAndHide(item);
    } else if (item instanceof Diamond) {
      this.diamonds.killAndHide(item);
    }
    item.body.enable = false;
  }

  /**
   * 플레이어가 아이템을 수집했을 때 호출될 콜백 함수입니다.
   * @param {Player} player - 플레이어 객체
   * @param {Coin|Diamond} item - 수집된 아이템 객체
   */
  onPlayerCollect(player, item) {
    // 아이템의 종류에 따라 다른 처리를 합니다.
    if (item instanceof Coin) {
      // TODO: GameManager에 골드 추가 요청
      // this.scene.gameManager.addGold(item.value);
      console.log(`골드 획득: ${item.value}`);
    } else if (item instanceof Diamond) {
      // TODO: GameManager 또는 Player에 경험치 추가 요청
      // this.scene.player.addExp(item.value);
      console.log(`경험치 획득: ${item.value}`);
    }
    return item.type;
  }
}
