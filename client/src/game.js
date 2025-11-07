import LoadScene from "./scenes/LoadScene.js";
import MainScene from "./scenes/MainScene.js";
import PlayScene from "./scenes/PlayScene.js";

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [LoadScene, MainScene, PlayScene], // 등록 순서 중요
    physics: {
        default: "arcade",
        arcade: { debug: true }
    }
};

new Phaser.Game(config);
