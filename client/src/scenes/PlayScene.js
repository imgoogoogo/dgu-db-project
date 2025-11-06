export default class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.spritesheet("idle", "assets/character/Gangsters_1/Idle.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("walk", "assets/character/Gangsters_1/Run.png", { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        // 화면을 가득 채우는 타일 배경 (카메라 뷰 크기 기준)
        const cam = this.cameras.main;
        this.backgroundTile = this.add
            .tileSprite(0, 0, cam.width, cam.height, "background")
            .setOrigin(0)
            .setScrollFactor(0); // 카메라 스크롤과 함께 뷰에 고정

        // 플레이어 생성 (초기 idle 프레임), 가시성 향상을 위해 depth/scale 설정
        this.player = this.add.sprite(200, 200, "idle", 0).setDepth(10);
        // 필요 시 크기 조절: .setScale(2)

        // 애니메이션: idle / walk
        this.anims.create({ key: "idle", frames: this.anims.generateFrameNumbers("idle"), frameRate: 6, repeat: -1 });
        this.anims.create({ key: "walk", frames: this.anims.generateFrameNumbers("walk"), frameRate: 10, repeat: -1 });
        this.player.anims.play("idle", true);

        // 입력: 방향키 + WASD 모두 지원
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // 상태값: 마지막 바라보는 방향(left/right)과 현재 애니키
        this.lastFacing = "right";
        this.currentAnimKey = "idle";

        // 월드/카메라 설정: 카메라가 플레이어를 따라다니도록
        const worldWidth = 4000;
        const worldHeight = 2000;
        this.worldBounds = new Phaser.Geom.Rectangle(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    }

    update(time, delta) {
        // 카메라 스크롤에 맞춰 배경 타일 위치 갱신 (무한 배경 느낌)
        if (this.backgroundTile) {
            const cam = this.cameras.main;
            this.backgroundTile.tilePositionX = cam.scrollX;
            this.backgroundTile.tilePositionY = cam.scrollY;
        }

        // 8방향 이동 처리 (물리 비사용)
        const dt = (delta || 16.7) / 1000;
        const speed = 240; // px/s
        let vx = 0, vy = 0;

        const up = this.cursors.up.isDown || this.keys.W.isDown;
        const down = (this.cursors.down && this.cursors.down.isDown) || this.keys.S.isDown;
        const left = this.cursors.left.isDown || this.keys.A.isDown;
        const right = this.cursors.right.isDown || this.keys.D.isDown;

        if (left) vx = -speed; else if (right) vx = speed;
        if (up) vy = -speed; else if (down) vy = speed;

        // 대각선 정규화
        if (vx !== 0 && vy !== 0) {
            const inv = 1 / Math.sqrt(2);
            vx *= inv; vy *= inv;
        }

        // 좌표 갱신 + 월드 경계 클램프
        this.player.x = Phaser.Math.Clamp(this.player.x + vx * dt, this.worldBounds.left, this.worldBounds.right);
        this.player.y = Phaser.Math.Clamp(this.player.y + vy * dt, this.worldBounds.top, this.worldBounds.bottom);

        // 애니메이션/방향 처리 (idle / walk + flipX)
        const moving = vx !== 0 || vy !== 0;
        if (moving) {
            if (vx < 0) this.lastFacing = "left"; else if (vx > 0) this.lastFacing = "right";
            if (this.currentAnimKey !== "walk") {
                this.player.anims.play("walk", true);
                this.currentAnimKey = "walk";
            }
            this.player.setFlipX(this.lastFacing === "left");
        } else {
            if (this.currentAnimKey !== "idle") {
                this.player.anims.play("idle", true);
                this.currentAnimKey = "idle";
            }
            this.player.setFlipX(this.lastFacing === "left");
        }
    }
}
