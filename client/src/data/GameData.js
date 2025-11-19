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
          hp: 200,
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
          chance: 50,
        },
        {
          id: 2,
          name: "물의 검",
          type: "weapon",
          add_hp: 10,
          add_atk: 10,
          add_def: 5,
          description: "불꽃이 빛나는 검입니다.",
          chance: 50,
        },
      ],
    };

    this.gameState = {
      stage: {
        current: 1,
      },

      player: {
        level: 1,
        currentHp: this.gameDataSet.charInfo.totalHp,
        currentAtk: this.gameDataSet.charInfo.totalAtk,
        currentDef: this.gameDataSet.charInfo.totalDef,
        maxHp: this.gameDataSet.charInfo.totalHp,
        speed: 200,
        currentExp: 0,
        gold: 0,

        items: [],
      },

      monster: {
        killedInStage: 0,
        killedAll: 0,
      },

      system: {
        clock: 0,
      },
    };

    this.gameConfig = {
      stage: {
        initialMonsterCount: 5, // 스테이지 시작 몬스터 수
        monsterIncreasePerStage: 2, // 스테이지마다 몬스터 증가 수

        initialSpawnDelay: 1500, // 초기 스폰 시간 (ms)
        spawnDelayDecreaseFlat: 50, // 또는 스테이지마다 고정 감소 (50ms 줄이기)
        minSpawnDelay: 300, // 최소 스폰 시간 (ms)
      },

      level: {
        initialExpNeeded: 1, // 초기 레벨업에 필요한 경험치
        expIncreaseRate: 1.15, // 스테이지당 경험치 증가율 (15% 증가 예시)
      },
    };

    this.gameResult = {
      stage: 1,
      survivalTime: "18:45",
      kills: 0,
      goldEarned: 0,
      rewards: [],
    };
  }

  /* ------------------------------------------------------
      내부 유틸 함수 (path 기반 객체 접근)
  ------------------------------------------------------ */

  _getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => acc[key], obj);
  }

  _setByPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => acc[key], obj);
    target[lastKey] = value;
  }

  _addByPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => acc[key], obj);
    target[lastKey] += value;
  }

  /* ------------------------------------------------------
      gameState 관련 메서드
  ------------------------------------------------------ */

  getState(path) {
    return this._getByPath(this.gameState, path);
  }

  setState(path, value) {
    this._setByPath(this.gameState, path, value);
  }

  addState(path, value) {
    this._addByPath(this.gameState, path, value);
  }

  /* ------------------------------------------------------
      gameConfig 관련 메서드
  ------------------------------------------------------ */

  getConfig(path) {
    return this._getByPath(this.gameConfig, path);
  }

  setConfig(path, value) {
    this._setByPath(this.gameConfig, path, value);
  }

  addConfig(path, value) {
    this._addByPath(this.gameConfig, path, value);
  }

  getMonsterPerStage() {
    const initial = this.gameConfig.stage.initialMonsterCount;
    const increase = this.gameConfig.stage.monsterIncreasePerStage;
    const stage = this.gameState.stage.current;
    return initial + increase * (stage - 1);
  }

  getExpNeededLevel() {
    const initial = this.gameConfig.level.initialExpNeeded;
    const rate = this.gameConfig.level.expIncreaseRate;
    const level = this.gameState.player.level;
    return Math.floor(initial * Math.pow(rate, level - 1));
  }
}
