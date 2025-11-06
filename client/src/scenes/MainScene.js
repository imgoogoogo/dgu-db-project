export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("background", "assets/background.png");
    }

    create() {
        // 무한 반복 배경: 현재 캔버스 크기에 맞춰 생성 (화면 꽉 채우기)
        // tileSprite는 텍스처를 반복 타일링하며 tilePosition 변경으로 무한 스크롤 효과 가능
        const { width: sw, height: sh } = this.scale;
        this.backgroundTile = this.add.tileSprite(sw / 2, sh / 2, sw, sh, "background");

        // 윈도우 리사이즈 대응: 캔버스가 리사이즈되면 배경도 크기/위치 재조정
        // 주의: 이 콜백은 게임 config.scale.mode가 Phaser.Scale.RESIZE일 때 동작합니다.
        this.scale.on("resize", (gameSize) => {
            const { width, height } = gameSize;

            // 배경 재조정
            if (this.backgroundTile) {
                this.backgroundTile.setSize(width, height);
                this.backgroundTile.setPosition(width / 2, height / 2);
            }

            // 버튼 재배치 (정중앙 유지)
            if (this.buttons && this.buttons.length) {
                const cx = width / 2;
                const sp = 60;
                const by = height / 2 - ((this.buttons.length - 1) * sp) / 2;
                this.buttons.forEach((btn, i) => btn.setPosition(cx, by + sp * i));
            }
        });

        // 버튼 스타일 (반복 사용)
        const style = { fontSize: "38px", fill: "#ffffff" };
        // 중앙 정렬 배치
        const centerX = sw / 2;
        const spacing = 60; // 버튼 간 간격
        const labels = ["▶ PLAY", "🏆 RANKING", "💰 AUCTION", "🎒 INVENTORY", "⚙ SETTINGS"];
        const baseY = sh / 2 - ((labels.length - 1) * spacing) / 2;

        const playBtn = this.add.text(centerX, baseY + spacing * 0, labels[0], style).setOrigin(0.5).setInteractive();
        playBtn.on("pointerdown", () => this.scene.start("PlayScene"));

        const rankBtn = this.add.text(centerX, baseY + spacing * 1, labels[1], style).setOrigin(0.5).setInteractive();
        rankBtn.on("pointerdown", () => this.scene.start("RankScene"));

        const auctionBtn = this.add.text(centerX, baseY + spacing * 2, labels[2], style).setOrigin(0.5).setInteractive();
        auctionBtn.on("pointerdown", () => {
            // 나중에 AuctionScene 만들면 연결
            console.log("Auction button clicked (TODO)");
        });

        const inventoryBtn = this.add.text(centerX, baseY + spacing * 3, labels[3], style).setOrigin(0.5).setInteractive();
        inventoryBtn.on("pointerdown", () => {
            // 나중에 InventoryScene 만들면 연결
            console.log("Inventory button clicked (TODO)");
        });

        const settingsBtn = this.add.text(centerX, baseY + spacing * 4, labels[4], style).setOrigin(0.5).setInteractive();
        settingsBtn.on("pointerdown", () => {
            console.log("Settings clicked (TODO)");
        });

        // 리사이즈 대응을 위한 버튼 배열 저장
        this.buttons = [playBtn, rankBtn, auctionBtn, inventoryBtn, settingsBtn];

        // Hover 효과 (선택 사항) 
        this.input.on("gameobjectover", (pointer, gameObject) => {
            gameObject.setStyle({ fill: "#ffdc6a" });
        });

        this.input.on("gameobjectout", (pointer, gameObject) => {
            gameObject.setStyle({ fill: "#ffffff" });
        });
    }

    update(time, delta) {
        // 배경을 천천히 스크롤하여 무한 맵(무한 배경) 효과
        // 필요에 따라 속도/방향을 조절하세요.
        if (this.backgroundTile) {
            this.backgroundTile.tilePositionX += 0.3; // 오른쪽으로 천천히 이동
            // this.backgroundTile.tilePositionY += 0.1; // 위/아래 스크롤이 필요하면 사용
        }
    }
}
