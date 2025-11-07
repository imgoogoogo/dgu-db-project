// 번들러 없이 실행할 때는 에셋을 import하지 않고,
// Phaser 로더에 문서 기준의 정적 경로 문자열을 직접 넘깁니다.


export default class LoadScene extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  preload() {
    // 모든 에셋 경로의 공통 프리픽스 설정 (index.html이 있는 client 폴더 기준)
    this.load.setPath("assets/");
    this.load.image("background", "background.png");
    this.load.spritesheet("idle", "character/Gangsters_1/Idle.png", { 
      frameWidth: 128, 
      frameHeight: 128 
    });
    this.load.spritesheet("walk", "character/Gangsters_1/Run.png", { 
      frameWidth: 128, 
      frameHeight: 128 
    });
  }

  create() {
    this.anims.create({ 
        key: "idle", 
        frames: this.anims.generateFrameNumbers("idle"), 
        frameRate: 6, 
        repeat: -1,
    });
    this.anims.create({ 
        key: "walk", 
        frames: this.anims.generateFrameNumbers("walk"), 
        frameRate: 10, repeat: -1,
    });
    
    this.scene.start("MainScene");
  }
}