// 번들러 없이 실행할 때는 에셋을 import하지 않고,
// Phaser 로더에 문서 기준의 정적 경로 문자열을 직접 넘깁니다.

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  preload() {
    // 모든 에셋 경로의 공통 프리픽스 설정 (index.html이 있는 client 폴더 기준)
    this.load.setPath("assets/");
    this.load.image("logo", "logo.png");
    this.load.image("background", "background.png");
    this.load.image("icon_skull", "icons/skull.png");
    this.load.image("icon_clock", "icons/clock.png");
    this.load.image("icon_gold", "icons/coins.png");
    this.load.image("icon_heart", "icons/heart.png");
    this.load.image("icon_inventory", "icons/inventory_icon.png");
    this.load.image("icon_ranking", "icons/ranking_icon.png");
    this.load.image("icon_auction", "icons/auction_icon.png");
    this.load.image("background", "background.png");
    this.load.image("logo", "logo.png");
    this.load.image("play_button", "button/play_button.png");
    this.load.image("inventory_button", "button/inventory_button.png");
    this.load.image("ranking_button", "button/ranking_button.png");
    this.load.image("auction_button", "button/auction_button.png");
    this.load.image("kakaologin_button", "button/kakaologin_button.png");

    this.load.spritesheet("bullet", "bullet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("idle", "character/Gangsters_1/Idle.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("walk", "character/Gangsters_1/Run.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("dead", "character/Gangsters_1/Dead.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monster1", "monster/Zombie_1/Walk.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monster2", "monster/Zombie_2/Walk.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monster3", "monster/Zombie_3/Walk.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monster4", "monster/Zombie_4/Walk.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("monster5", "monster/Zombie_5/Walk.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("monster6", "monster/Zombie_6/Walk.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("monster7", "monster/Zombie_7/Walk.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("coin", "Coin_Gems/MonedaD.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("diamond", "Coin_Gems/spr_coin_azu.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.anims.create({
      key: "bullet",
      frames: this.anims.generateFrameNumbers("bullet", {
        start: 331,
        end: 334,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle"),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("walk"),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers("dead"),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: "monster1",
      frames: this.anims.generateFrameNumbers("monster1"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster2",
      frames: this.anims.generateFrameNumbers("monster2"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster3",
      frames: this.anims.generateFrameNumbers("monster3"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster4",
      frames: this.anims.generateFrameNumbers("monster4"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster5",
      frames: this.anims.generateFrameNumbers("monster5"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster6",
      frames: this.anims.generateFrameNumbers("monster6"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "monster7",
      frames: this.anims.generateFrameNumbers("monster7"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin"),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "diamond",
      frames: this.anims.generateFrameNumbers("diamond"),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.start("MainScene");
  }
}
