import LoadScene from "../scenes/LoadScene.js";
import MainScene from "../scenes/MainScene.js";
import PlayScene from "../scenes/PlayScene.js";

export const PHASER_CONFIG = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [LoadScene, MainScene, PlayScene], // 등록 순서 중요
    physics: {
        default: "arcade",
        arcade: { debug: false }
    }
};

export const STAGE_CONFIG = {
    initialStage: 1,
    initialMonsters: 30,
    monstersIncPerStage: 10,
}