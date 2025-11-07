import Player from "../characters/Player.js";
import Monster from "../characters/Monster.js";
import ExpBar from "../ui/ExpBar.js";
import CountMonster from "../ui/CountMonster.js";
import Clock from "../ui/Clock.js";
import Gold from "../ui/Gold.js";
import Stage from "../ui/Stage.js";

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

        // monster
        this.monsters = this.physics.add.group({
            classType: Monster,
            runChildUpdate: true // ⭐️ 이 옵션이 핵심입니다.
        });

        this.monsters.get(400, 300, "monster"); // 'monster'는 LoadScene에서 로드한 텍스처 키

        // expBar : UI
        this.expBar = new ExpBar(this, 0, 10);

        // clock : UI
        this.clock = new Clock(this, 20, 80);
        
        // countMonster : UI
        this.countMonster = new CountMonster(this, cam.width / 2 + 400, 80);

        // gold : UI
        this.gold = new Gold(this, 20, 120);

        // stage : UI
        this.stage = new Stage(this, cam.width / 2, 80);

    }

    update() {
        // ⭐️ 플레이어의 update 함수를 호출하여 스스로 움직이게 합니다.
        this.player.update();

        // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
        this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
        this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
    }
}
