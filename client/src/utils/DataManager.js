class DataManager {
    constructor() {
        // 데이터가 로드되었는지 확인하는 플래그
        this.isDataLoaded = false;

        // 데이터를 저장할 객체들
        this.playerData = null;
        this.inventoryData = null;
        this.itemsData = null;
        this.monsterData = null;
        this.auctionData = null; // 'autionData' -> 'auctionData' 오타 수정
    }

    /**
     * 서버에서 모든 게임 데이터를 비동기적으로 불러옵니다.
     * async/await를 사용하여 코드를 동기식처럼 보이게 만듭니다.
     */
    async loadDataFromServer() {
        // 이미 데이터가 로드되었다면 다시 로드하지 않습니다.
        if (this.isDataLoaded) {
            return;
        }

        try {
            // Promise.all을 사용하여 모든 데이터 요청을 병렬로 처리합니다.
            const responses = await Promise.all([
                fetch('/api/player'),    // 서버의 실제 API 엔드포인트로 수정해야 합니다.
                fetch('/api/inventory'),
                fetch('/api/items'),
                fetch('/api/monsters'),
                fetch('/api/auction')
            ]);

            // 모든 응답이 정상인지 확인합니다.
            for (const res of responses) {
                if (!res.ok) {
                    throw new Error(`서버 응답 오류: ${res.status}`);
                }
            }

            // 각 응답을 JSON으로 파싱합니다.
            const [player, inventory, items, monsters, auction] = await Promise.all(
                responses.map(res => res.json())
            );

            // 파싱된 데이터를 클래스 속성에 저장합니다.
            this.playerData = player;
            this.inventoryData = inventory;
            this.itemsData = items;
            this.monsterData = monsters;
            this.auctionData = auction;

            // 로딩 완료 플래그를 설정합니다.
            this.isDataLoaded = true;
            console.log("모든 서버 데이터 로딩 완료!");

        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            // 여기에 로딩 실패 시의 로직을 추가할 수 있습니다. (예: 에러 씬으로 전환)
            this.isDataLoaded = false;
        }
    }
}

// DataManager를 싱글톤(Singleton)으로 만들어 게임 전체에서 하나의 인스턴스만 사용하도록 합니다.
const instance = new DataManager();
export default instance;