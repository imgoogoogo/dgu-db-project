import Player from "../characters/Player.js";
import GameManager from "../managers/GameManager.js";
import ChatManager from "../managers/ChatManager.js";
import ExpBar from "../ui/ExpBar.js";
import remainMonster from "../ui/RemainMonster.js";
import GameData from "../data/GameData.js";
import Clock from "../ui/Clock.js";
import Gold from "../ui/Gold.js";
import Stage from "../ui/Stage.js";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {}

  create() {
    // camera
    const cam = this.cameras.main;

    // background
    this.backgroundTile = this.add
      .tileSprite(0, 0, cam.width, cam.height, "background")
      .setOrigin(0)
      .setScrollFactor(0);

    // --- UI 생성 ---
    this.expBar = new ExpBar(this, 0, 0);
    this.clock = new Clock(this, 20, 80);
    this.remainMonster = new remainMonster(this, cam.width / 2 + 400, 80);
    this.gold = new Gold(this, 20, 120);
    this.stage = new Stage(this, cam.width / 2, 80);

    // data
    this.gameData = new GameData();

    // player
    this.player = new Player(this, 200, 200, "idle");

    // managers
    this.chatManager = new ChatManager(this, 10, cam.height - 150, 400);
    this.gameManager = new GameManager(this);

    this.chatManager.addMessage("게임 시작!", "#00ff00ff", 1000);
    this.chatManager.addMessage(
      "몰려오는 몬스터를 처치하고 생존하세요!",
      "#dc0e0eff",
      2000
    );
  }

  update() {
    // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
    this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
    this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
  }
}
