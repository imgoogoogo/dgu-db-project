import MainScene from "./scenes/MainScene.js";
import PlayScene from "./scenes/PlayScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene, PlayScene], // 등록 순서 중요
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 300 }, debug: false }
    }
};

new Phaser.Game(config);
