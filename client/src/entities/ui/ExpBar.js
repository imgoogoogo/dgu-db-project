export default class ExpBar extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);

        // 경험치 바의 위치 설정
        this.x = 0; this.y = 10;
        // 경험치 바의 크기 설정
        this.width = scene.cameras.main.width; 
        this.height = 30;
        // 경험치 바의 최대 경험치 및 현재 경험치 설정
        this.maxExp = 100;
        this.currentExp = 0;

        this.setScrollFactor(0); // UI 요소가 카메라 스크롤에 영향을 받지 않도록 설정

        scene.add.existing(this);
        this.draw();
    }

    draw() {
        this.clear();

        // 배경 바
        this.fillStyle(0x00BBFE, 1);
        this.fillRect(this.x, this.y, this.width, this.height);

        // 경험치 바
        // const expWidth = (this.currentExp / this.maxExp) * this.width;
        // this.fillStyle(0x00ff00, 1);
        // this.fillRect(this.x, this.y, expWidth, this.height);
    }
}