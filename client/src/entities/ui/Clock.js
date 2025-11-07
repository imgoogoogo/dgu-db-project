export default class Clock extends Phaser.GameObjects.Container {
    constructor(scene, pos_x, pos_y) {
        super(scene, pos_x, pos_y);

        this.setScrollFactor(0);
        scene.add.existing(this);
        
        this.draw();
        this.startTimer(); // 타이머 시작 함수 호출
    }

    draw() {
        // 시계 아이콘을 생성하고 컨테이너에 추가합니다.
        const icon = this.scene.add.image(0, 0, 'icon_clock').setOrigin(0, 0.5).setScale(0.8);
        this.add(icon);

        // 시간 텍스트를 생성하고 아이콘 옆에 추가합니다.
        this.timerText = this.scene.add.text(icon.displayWidth + 10, 0, '00:00', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        this.add(this.timerText);
    }

    startTimer() {
        // 1초마다 시간을 업데이트하는 TimerEvent를 설정합니다.
        this.gameTime = 0;
        this.scene.time.addEvent({
            delay: 1000, // 1000ms = 1초
            callback: () => {
                this.gameTime++; // 1초씩 증가
                const minutes = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
                const seconds = (this.gameTime % 60).toString().padStart(2, '0');
                this.timerText.setText(`${minutes}:${seconds}`);
            },
            callbackScope: this,
            loop: true
        });
    }
}