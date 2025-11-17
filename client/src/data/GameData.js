// GameData.js
export default class GameData {
  constructor() {
    this.gameDataSet = {
      charInfo: {
        name: "John Doe",
        totalHp: 100,
        totalAtk: 200,
        totalDef: 300,
      },
      monsters: [
        {
          id: 1,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 50,
          chance: 100,
        },
        {
          id: 2,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
        {
          id: 3,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
        {
          id: 4,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
        {
          id: 5,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
        {
          id: 6,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
        {
          id: 7,
          name: "Goblin",
          hp: 10,
          atk: 10,
          def: 5,
          speed: 60,
          chance: 0.4,
        },
      ],
      items: [
        {
          id: 1,
          name: "화염의 검",
          type: "weapon",
          add_hp: 10,
          add_atk: 10,
          add_def: 5,
          description: "불꽃이 빛나는 검입니다.",
        },
        {
          id: 2,
          name: "물의 검",
          type: "weapon",
          add_hp: 10,
          add_atk: 10,
          add_def: 5,
          description: "불꽃이 빛나는 검입니다.",
        },
      ],
    };

    // ⭐️ 모든 멤버 변수를 Private 필드('#')로 변경합니다.
    this.currentStage = 1;
    this.playerCurrentHp = this.gameDataSet.charInfo.totalHp;
    this.playerMaxHp = this.gameDataSet.charInfo.totalHp;
    this.playerLevel = 1;
    this.playerSpeed = 200;
    this.monsterPerStage = 5;
    this.monsterKilledCount = 0;
    this.monsterAllKilledCount = 0;
    this.currentExp = 0;
    this.expNeededLevel = 100;
    this.clock = 0;
    this.gold = 0;
  }

  // --- Getter: 외부에서 값을 '읽기' 위한 함수들 ---
  getStage() {
    return this.currentStage;
  }
  getPlayerHp() {
    return this.playerCurrentHp;
  }
  getMonsterSpawnDelay() {
    const base = 1500;
    const delay = base - this.currentStage * 100;
    return Math.max(10, delay); // 최소 10ms
  }
  getMonsterPerStage() {
    return this.monsterPerStage;
  }
  getMonsterKilledCount() {
    return this.monsterKilledCount;
  }
  getPlayerLevel() {
    return this.playerLevel;
  }
  getCurrentExp() {
    return this.currentExp;
  }
  getExpNeededLevel() {
    return this.expNeededLevel;
  }
  getGold() {
    return this.gold;
  }

  // --- 값을 변경하는 메소드들 ---

  // 스테이지 설정 (이름 좋음)
  setStage(stage) {
    this.currentStage = stage;
    this.monsterPerStage = 5 + this.currentStage * 5;
    this.monsterKilledCount = 0;
  }

  // 몬스터 처치 (이름 좋음)
  incrementMonsterKilled() {
    this.monsterKilledCount++;
  }

  // 골드 추가 (이름 좋음)
  addGold(amount) {
    if (amount > 0) {
      this.gold += amount;
    }
  }

  // ⭐️ 데미지 처리 (setPlayerHP -> takeDamage 로 이름 변경)
  // "데미지를 입는다"는 의도를 명확하게 표현합니다.
  takeDamage(damageAmount) {
    this.playerCurrentHp -= damageAmount;
    if (this.playerCurrentHp < 0) {
      this.playerCurrentHp = 0;
    }
  }

  // 경험치 추가 및 레벨업 로직 (이름 좋음)
  addExp(amount) {
    if (amount <= 0) return;

    this.currentExp += amount;
    // ⭐️ 레벨업 로직을 별도 private 함수로 분리하면 더 깔끔해집니다.
    if (this.currentExp >= this.expNeededLevel) {
      this.levelUp();
    }
  }

  // ⭐️ Private 메소드로 레벨업 로직 분리
  levelUp() {
    this.playerLevel++;
    this.currentExp -= this.expNeededLevel; // ⭐️ 경험치 이월 로직 수정
    this.expNeededLevel += 50;
    console.log(`레벨업! 현재 레벨: ${this.playerLevel}`);
    // TODO: 레벨업 이펙트나 사운드 이벤트 발생
  }
}
