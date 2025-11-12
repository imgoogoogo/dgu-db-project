// GameData.js
export default class GameData {
  // ⭐️ 모든 멤버 변수를 Private 필드('#')로 변경합니다.
  #currentStage = 1;
  #playerMaxHp = 100;
  #playerCurrentHp = 100;
  #monsterPerStage = 10;
  #monsterKilledCount = 0;
  #playerLevel = 1;
  #currentExp = 0;
  #expNeededLevel = 100;
  #clock = 0;
  #gold = 0;

  // --- Getter: 외부에서 값을 '읽기' 위한 함수들 ---
  getStage() {
    return this.#currentStage;
  }
  getPlayerHp() {
    return this.#playerCurrentHp;
  }
  getMonsterPerStage() {
    return this.#monsterPerStage;
  }
  getMonsterKilledCount() {
    return this.#monsterKilledCount;
  }
  getPlayerLevel() {
    return this.#playerLevel;
  }
  getCurrentExp() {
    return this.#currentExp;
  }
  getExpNeededLevel() {
    return this.#expNeededLevel;
  }
  getGold() {
    return this.#gold;
  }

  // --- 값을 변경하는 메소드들 ---

  // 스테이지 설정 (이름 좋음)
  setStage(stage) {
    this.#currentStage = stage;
    this.#monsterPerStage = stage * 10;
    this.#monsterKilledCount = 0;
  }

  // 몬스터 처치 (이름 좋음)
  incrementMonsterKilled() {
    this.#monsterKilledCount++;
  }

  // 골드 추가 (이름 좋음)
  addGold(amount) {
    if (amount > 0) {
      this.#gold += amount;
    }
  }

  // ⭐️ 데미지 처리 (setPlayerHP -> takeDamage 로 이름 변경)
  // "데미지를 입는다"는 의도를 명확하게 표현합니다.
  takeDamage(damageAmount) {
    this.#playerCurrentHp -= damageAmount;
    if (this.#playerCurrentHp < 0) {
      this.#playerCurrentHp = 0;
    }
  }

  // 경험치 추가 및 레벨업 로직 (이름 좋음)
  addExp(amount) {
    if (amount <= 0) return;

    this.#currentExp += amount;
    // ⭐️ 레벨업 로직을 별도 private 함수로 분리하면 더 깔끔해집니다.
    if (this.#currentExp >= this.#expNeededLevel) {
      this.#levelUp();
    }
  }

  // ⭐️ Private 메소드로 레벨업 로직 분리
  #levelUp() {
    this.#playerLevel++;
    this.#currentExp -= this.#expNeededLevel; // ⭐️ 경험치 이월 로직 수정
    this.#expNeededLevel += 50;
    console.log(`레벨업! 현재 레벨: ${this.#playerLevel}`);
    // TODO: 레벨업 이펙트나 사운드 이벤트 발생
  }

  // 리셋 함수는 그대로 유지
  reset() {
    // Private 필드는 Object.assign으로 덮어쓸 수 없으므로, 수동으로 초기화합니다.
    this.#currentStage = 1;
    this.#playerMaxHp = 100;
    this.#playerCurrentHp = 100;
    this.#monsterPerStage = 10;
    this.#monsterKilledCount = 0;
    this.#playerLevel = 1;
    this.#currentExp = 0;
    this.#expNeededLevel = 100;
    this.#clock = 0;
    this.#gold = 0;
  }
}
