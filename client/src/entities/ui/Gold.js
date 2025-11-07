export default class Gold extends Phaser.GameObjects.Container {
    constructor(scene, pos_x, pos_y) {
        super(scene, pos_x, pos_y);

        this.setScrollFactor(0); // UI 요소가 카메라 스크롤에 영향을 받지 않도록 설정
        this.scene.add.existing(this);
        this.draw();
    }
    
    draw() {
        // icon
        const icon = this.scene.add.image(0, 0, 'icon_gold').setOrigin(0, 0.5).setScale(0.8);
        this.add(icon);

        // text
        this.countText = this.scene.add.text(icon.displayWidth + 10, 0, '0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.add(this.countText);
    }
}