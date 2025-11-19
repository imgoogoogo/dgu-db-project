import LoadScene from "../scenes/LoadScene.js";
import MainScene from "../scenes/MainScene.js";
import PlayScene from "../scenes/PlayScene.js";
import PopupScene from "../scenes/PopupScene.js";

export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [LoadScene, MainScene, PlayScene, PopupScene], // 등록 순서 중요
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  render: {
    pixelArt: true, // 픽셀 아트 스타일로 렌더링
  },
};

export const STAGE_CONFIG = {
  initialStage: 1,
  initialMonsters: 30,
  monstersIncPerStage: 10,
};

export const PLAYER_STATS = {
  INITIAL_SPEED: 200,
  INITIAL_MAX_HEALTH: 100,
  INITIAL_ATTACK_POWER: 20,
  INITIAL_ATTACK_SPEED: 500,
};

export const ITEM_DATA = {
  COIN_VALUE: 10,
  DIAMOND_EXP: 50,
};
