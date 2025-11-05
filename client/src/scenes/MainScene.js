export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
    }

    create() {
        this.add.image(400, 300, "sky");

        const text = this.add.text(300, 280, "▶ PLAY", { fontSize: "40px", fill: "#fff" });
        text.setInteractive();

        text.on("pointerdown", () => {
            this.scene.start("PlayScene");
        });
    }
}
