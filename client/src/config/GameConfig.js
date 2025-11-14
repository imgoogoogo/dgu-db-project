import LoadScene from "../scenes/LoadScene.js";
import MainScene from "../scenes/MainScene.js";
import PlayScene from "../scenes/PlayScene.js";

export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  dom: {
    createContainer: true,
  },
  scene: [LoadScene, MainScene, PlayScene], // 등록 순서 중요
  physics: {
    default: "arcade",
    arcade: { debug: true },
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
