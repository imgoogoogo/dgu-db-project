import Player from "../characters/Player.js";
import MonsterManager from "../utils/MonsterManager.js";
import BulletManager from "../utils/BulletManager.js";
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
            .setScrollFactor(0);
        
        // --- UI 생성 ---
        this.expBar = new ExpBar(this, 0, 10)
        this.clock = new Clock(this, 20, 80)
        this.countMonster = new CountMonster(this, cam.width / 2 + 400, 80);
        this.gold = new Gold(this, 20, 120);
        this.stage = new Stage(this, cam.width / 2, 80);

        // player
        this.player = new Player(this, 200, 200, "idle");

        // manager (game rules)
        this.monsterManager = new MonsterManager(this); // 몬스터 스폰 관리
        this.monsterManager.startEvent(1000); // 1초 간격으로 몬스터 생성 시작
        this.physics.add.collider(                      // 플레이어 몬스터 충돌
            this.player, 
            this.monsters,
            this.onMonsterHitPlayer,
            null, 
            this
        );

        this.bulletManager = new BulletManager(this);
        this.bulletManager.startEvent(1000); // 0.5초 간격으로 총알 발사 시작
        this.physics.add.collider(                      // 총알 몬스터 충돌
            this.bullets,
            this.monsters,
            this.onBulletHitMonster,
            null, 
            this
        );
    }

    update() {
        // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
        this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
        this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
    }

    onMonsterHitPlayer(player, monster) {
        console.log("플레이어가 몬스터와 충돌!");
    }

    onBulletHitMonster(bullet, monster) {
        console.log("총알이 몬스터와 충돌!");
        this.bulletManager.removeBullet(bullet);
        this.monsterManager.removeMonster(monster);
    }

}
