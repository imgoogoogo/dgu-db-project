class DataManager {
  constructor() {
    // ⭐️ 동적 데이터 (플레이어의 현재 상태)
    this.playerState = {
      name: "Player1",
      hp: 100,
      atk: 20,
      def: 0,
      speed: 200,
      gold: 0,
      max_stage: 0,
      last_played: null,
    };
  }

  // --- 데이터 변경 메소드 ---
  addGold(amount) {
    this.playerState.gold += amount;
    // TODO: UI 업데이트 이벤트 발생
  }

  levelUp() {
    this.playerState.level++;
    this.playerState.exp = 0; // 또는 초과분만 남김
    this.playerState.maxExp *= 1.5; // 예시: 다음 레벨업에 필요한 경험치 증가
    // TODO: 레벨업 이벤트 발생
  }

  // --- DB 연동 메소드 (미래의 창구) ---

  /**
   * 현재 게임 상태를 서버에 저장합니다.
   */
  async saveData() {
    try {
      console.log("서버에 데이터를 저장합니다...", this.playerState);
      // const response = await fetch('/api/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(this.playerState)
      // });
      // const result = await response.json();
      // console.log(result.message);
    } catch (error) {
      console.error("데이터 저장 실패:", error);
    }
  }

  /**
   * 서버에서 게임 상태를 불러옵니다.
   */
  async loadData() {
    try {
      console.log("서버에서 데이터를 불러옵니다...");
      // const response = await fetch('/api/load');
      // const loadedData = await response.json();
      // this.playerState = loadedData;
      // console.log("데이터 로드 완료:", this.playerState);
      // TODO: 로드된 데이터로 게임 전체를 업데이트하는 이벤트 발생
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }
}

// ⭐️ 싱글톤 패턴: 게임 전체에서 단 하나의 DataManager 인스턴스만 사용하도록 보장
const instance = new DataManager();
export default instance;
