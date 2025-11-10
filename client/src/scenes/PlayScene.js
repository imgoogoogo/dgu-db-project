import Player from "../characters/Player.js";
import MonsterManager from "../utils/MonsterManager.js";
import BulletManager from "../utils/BulletManager.js";
import GameManager from "../utils/GameManager.js";
import ExpBar from "../ui/ExpBar.js";
import AliveMonster from "../ui/AliveMonster.js";
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
    this.expBar = new ExpBar(this, 0, 10);
    this.clock = new Clock(this, 20, 80);
    this.aliveMonster = new AliveMonster(this, cam.width / 2 + 400, 80);
    this.gold = new Gold(this, 20, 120);
    this.stage = new Stage(this, cam.width / 2, 80);

    // player
    this.player = new Player(this, 200, 200, "idle");

    // monster manager
    this.monsterManager = new MonsterManager(this);

    // bullet manager
    this.bulletManager = new BulletManager(this);

    // stage manager
    this.gameManager = new GameManager(this);
  }

  update() {
    // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
    this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
    this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
  }
}
