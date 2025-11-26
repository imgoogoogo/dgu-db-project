/**
 * 서버 API와 통신을 담당하는 싱글톤 클래스입니다.
 * 로그인 정보(playerId, jwt)를 내부적으로 관리하며, 모든 API 요청을 처리합니다.
 */
class DataManager {
  // API 서버의 기본 URL
  #BASE_URL = "http://localhost:3000/api"; // 실제 서버 주소에 맞게 변경해야 할 수 있습니다.

  // 로그인 후 서버로부터 받는 데이터
  #playerId = null;
  #jwt = null;

  /**
   * API 요청을 보내는 내부 헬퍼 함수
   * @param {string} endpoint - /api 이후의 경로 (예: /auth/login)
   * @param {string} method - 'GET', 'POST', 'PATCH', 'DELETE' 등
   * @param {object} [body=null] - 요청에 담아 보낼 데이터 (body가 없는 요청은 null)
   * @param {boolean} [isAuth=false] - JWT 인증이 필요한 요청인지 여부
   * @returns {Promise<object>} - 서버로부터 받은 JSON 데이터
   */
  async #request(endpoint, method, body = null, isAuth = false) {
    const url = this.#BASE_URL + endpoint;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (isAuth) {
      if (!this.#jwt) {
        throw new Error("인증 토큰(JWT)이 없습니다. 로그인이 필요합니다.");
      }
      options.headers["Authorization"] = `Bearer ${this.#jwt}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "서버 통신에 실패했습니다.");
      }

      return data;
    } catch (error) {
      console.error(`API 요청 실패: ${method} ${url}`, error);
      throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있게 함
    }
  }

  setJWT(jwt) {
    this.#jwt = jwt;
  }

  getJWT() {
    return this.#jwt;
  }

  // --- Auth ---

  async loginKakao() {
    // fetch 대신 브라우저 리다이렉트로 인증 시작
    window.location.href = "http://localhost:3000/api/auth/kakao/login";
  }

  /**
   * 서버에 로그아웃을 요청하고, 저장된 로그인 정보를 초기화합니다.
   */
  async logout() {
    await this.#request("/auth/logout", "POST", { playerId: this.#playerId });
    this.#playerId = null;
    this.#jwt = null;
    console.log("로그아웃 되었습니다.");
  }

  // --- Inventory ---

  /**
   * 현재 플레이어의 인벤토리 정보를 조회합니다. (인벤토리 초기 접속)
   * @returns {Promise<{items: Array, charStats: Array}>}
   */
  async getInventory() {
    console.log(this.#jwt);
    const response = await this.#request(`/inventory`, "GET", null, true); // 인증 필요
    return response.data;
  }

  /**
   * 플레이어의 스탯 강화를 요청합니다.
   * @param {{hp?: number, atk?: number, def?: number}} stats - 강화할 스탯 정보
   */
  async updatePlayerStats(stats) {
    const body = { stat: stats };
    console.log(body);
    await this.#request("/inventory/enforce", "PATCH", body, true); // 인증 필요
  }

  async updateItemEquip(item) {
    let equipped = item.equipped ? 1 : 0; // 현재 상태의 반대로 설정
    const body = { inventory_id: item.id, equipped: equipped };
    await this.#request("/inventory/equip", "PATCH", body, true); // 인증 필요
  }

  async sellItem(item) {
    const body = { inventory_id: item.id, sellGold: item.price };
    await this.#request("/inventory/sell", "POST", body, true); // 인증 필요
  }

  // --- Ranking ---

  /**
   * 전체 랭킹 정보를 조회합니다.
   */
  async getRanking() {
    const response = await this.#request("/ranking", "GET", null, true); // 인증 필요
    return response;
  }

  // --- Auction ---

  /**
   * 거래소의 모든 아이템 목록을 조회합니다.
   */
  async getAuctionList() {
    const response = await this.#request("/auction", "GET", null, true); // 인증 필요
    return response.data;
  }

  /**
   * 거래소의 아이템을 구매합니다.
   * @param {string} auctionId - 구매할 경매 ID
   */
  async buyItem(auctionId) {
    const body = { auction_id: auctionId };
    await this.#request("/auction/buy", "POST", body, true); // 인증 필요
  }

  /**
   * 거래소에 등록한 아이템 판매를 취소합니다.
   * @param {string} auctionId - 취소할 경매 ID
   */
  async cancelAuction(auctionId) {
    const body = { auction_id: auctionId };
    await this.#request(`/auction/cancel`, "DELETE", body, true); // 인증 필요
  }

  // --- Game ---

  async getGameDataSet() {
    const response = await this.#request("/game", "GET", null, true); // 인증 필요
    return response;
  }

  async getGameConfig() {
    const response = await this.#request("/game/config", "GET", null, false); // 인증 필요 없음
    return response.config;
  }

  /**
   * 한 판의 게임 결과를 서버에 저장합니다.
   * @param {{stage: number, killCount: number, playTime: number, items: Array, goldEarned: number}} result
   */
  async saveGameResult(result) {
    const body = {
      stage: result.stage,
      survivalTime: result.survivalTime,
      kills: result.kills,
      goldEarned: result.goldEarned,
      rewards: result.rewards.map((item) => item.id),
    };
    console.log(body);
    await this.#request("/game/save", "POST", body, true); // 인증 필요
  }
}

// 싱글톤 인스턴스를 생성하여 내보냅니다.
const instance = new DataManager();
export default instance;
