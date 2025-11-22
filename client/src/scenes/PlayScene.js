import Player from "../characters/Player.js";
import GameManager from "../managers/GameManager.js";
import ChatManager from "../managers/ChatManager.js";
import ExpBar from "../ui/ExpBar.js";
import RemainMonster from "../ui/RemainMonster.js";
import GameData from "../data/GameData.js";
import Clock from "../ui/Clock.js";
import Gold from "../ui/Gold.js";
import Stage from "../ui/Stage.js";
import HpBar from "../ui/HpBar.js";
import SkillWindow from "../ui/SkillWindow.js";

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

    // data
    this.gameData = new GameData();

    // --- UI 생성 ---
    this.expBar = new ExpBar(this, 0, 0);
    this.hpBar = new HpBar(
      this,
      20,
      90,
      this.gameData.getState("player.currentHp")
    );
    this.skillWindow = new SkillWindow(this, 20, 150);
    this.clock = new Clock(this, 20, 50);
    this.gold = new Gold(
      this,
      (cam.width / 2 + this.expBar.levelText.x) / 2,
      50
    );
    this.stage = new Stage(this, cam.width / 2, 60);
    this.remainMonster = new RemainMonster(this, this.clock.x + 150, 50);

    // player
    this.player = new Player(this, 200, 200, "idle");

    // managers
    this.chatManager = new ChatManager(this, 10, cam.height / 2 - 150, 400);
    this.gameManager = new GameManager(this);

    this.chatManager.addMessage(
      "몰려오는 몬스터를 처치하고 생존하세요!",
      "#ff0000ff",
      1000
    );
  }

  update() {
    // 카메라의 스크롤 값에 따라 배경 타일의 텍스처 위치를 업데이트
    this.backgroundTile.tilePositionX = this.cameras.main.scrollX;
    this.backgroundTile.tilePositionY = this.cameras.main.scrollY;
  }
}
