export default class ChatManager {
  constructor(scene, x, y, width, maxMessages = 5) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.maxMessages = maxMessages;

    this.textHeight = 18;

    this.textGroup = [];

    this.background = scene.add
      .rectangle(x, y, width, maxMessages * this.textHeight + 20, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setDepth(1000)
      .setScrollFactor(0);
  }

  addMessage(text, color = "#ffffff", delay = 0) {
    // 🔥 메시지 출력 딜레이 적용
    this.scene.time.delayedCall(delay, () => {
      this._showMessage(text, color);
    });
  }

  // 내부에서 실제 메시지를 생성하는 함수
  _showMessage(text, color) {
    const msgY =
      this.y +
      (this.maxMessages * this.textHeight + 20) -
      10 -
      this.textGroup.length * this.textHeight -
      this.textHeight;

    const msg = this.scene.add
      .text(this.x + 10, msgY, text, {
        fontSize: "14px",
        color: color,
      })
      .setDepth(1001)
      .setScrollFactor(0);

    this.textGroup.push(msg);

    // 최대 메시지 수 초과 시 맨 위 삭제
    if (this.textGroup.length > this.maxMessages) {
      const removed = this.textGroup.shift();
      removed.destroy();
    }

    this.rearrangeMessages();

    // 3초 후 자동 삭제
    this.scene.time.delayedCall(3000, () => {
      this.removeMessage(msg);
    });
  }

  removeMessage(msg) {
    const index = this.textGroup.indexOf(msg);
    if (index !== -1) {
      this.textGroup.splice(index, 1);
      msg.destroy();

      this.rearrangeMessages();
    }
  }

  // 아래 기준 정렬
  rearrangeMessages() {
    this.textGroup.forEach((msg, i) => {
      msg.y =
        this.y +
        (this.maxMessages * this.textHeight + 20) -
        10 -
        (this.textGroup.length - 1 - i) * this.textHeight -
        this.textHeight;
    });
  }
}
