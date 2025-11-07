import Player, { Direction } from "../entities/characters/Player.js";
import ExpBar from "../entities/ui/ExpBar.js";

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    create() {
        // camera
        const cam = this.cameras.main;

        // background
        this.backgroundTile = this.add
            .tileSprite(0, 0, cam.width, cam.height, "background")
            .setOrigin(0)
            .setScrollFactor(0); // 카메라 스크롤과 함께 뷰에 고정

        // player
        this.player = new Player(this, 200, 200, "idle");
        cam.startFollow(this.player, true, 0.1, 0.1);

        // keys
        this.keyboardInput = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // expBar : UI
        this.expBar = new ExpBar(this);

        // clock : UI
        this.timerText = this.add.text(cam.width / 2, 20, 'Time: 00:00', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0).setScrollFactor(0); // 화면 상단 중앙에 고정

        this.gameTime = 0;
        this.time.addEvent({
            delay: 1000, // 1000ms = 1초
            callback: () => {
                this.gameTime++; // 1초씩 증가
                const minutes = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
                const seconds = (this.gameTime % 60).toString().padStart(2, '0');
                this.timerText.setText(`Time: ${minutes}:${seconds}`);
            },
            callbackScope: this,
            loop: true
        });
        

        // countMonster : UI

    }

    update() {
        // player movement
        this.movePlayerManager();

        // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
        this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
        this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
    }

    movePlayerManager() {
        const isMoving = 
            this.keyboardInput.left.isDown || this.wasdKeys.left.isDown ||
            this.keyboardInput.right.isDown || this.wasdKeys.right.isDown ||
            this.keyboardInput.up.isDown || this.wasdKeys.up.isDown ||
            this.keyboardInput.down.isDown || this.wasdKeys.down.isDown;

        if (isMoving) {
            // 좌우 이동
            if (this.keyboardInput.left.isDown || this.wasdKeys.left.isDown) {
                this.player.move(Direction.Left);
            } else if (this.keyboardInput.right.isDown || this.wasdKeys.right.isDown) {
                this.player.move(Direction.Right);
            }
            // 상하 이동
            if (this.keyboardInput.up.isDown || this.wasdKeys.up.isDown) {
                this.player.move(Direction.Up);
            } else if (this.keyboardInput.down.isDown || this.wasdKeys.down.isDown) {
                this.player.move(Direction.Down);
            }
        } else {
            this.player.stop();
        }
    }
}
