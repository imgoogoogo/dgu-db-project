export default class Stage extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x, y, 'Stage 1', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        this.setOrigin(0, 0);
        this.setScrollFactor(0); // 카메라가 움직여도 UI가 화면에 고정되도록 설정
        scene.add.existing(this);
    }
}