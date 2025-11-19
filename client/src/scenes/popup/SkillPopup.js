// SkillPopup.js
export default class SkillPopup {
  constructor(scene, skills, onSelect) {
    this.scene = scene;
    this.skills = skills;
    this.onSelect = onSelect;

    this.create();
  }

  create() {
    const cam = this.scene.cameras.main;
    const { width, height } = cam;

    // 팝업 크기 비율
    const popupWidth = width * 0.7;
    const popupHeight = height * 0.75;

    // 카드 크기 비율
    const cardWidth = width * 0.2;
    const cardHeight = height * 0.5;

    // Overlay
    this.overlay = this.scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.85)
      .setOrigin(0)
      .setDepth(9000)
      .setAlpha(0)
      .setInteractive();

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 0.85,
      duration: 300,
      ease: "Power2",
    });

    // Popup Container
    this.popup = this.scene.add
      .container(width / 2, height / 2)
      .setDepth(9001)
      .setAlpha(0)
      .setScale(0.9);

    this.scene.tweens.add({
      targets: this.popup,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: "Power2",
    });

    // 팝업 배경
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1d2e, 1);
    bg.lineStyle(3, 0xffffff, 0.06);
    bg.fillRoundedRect(
      -popupWidth / 2,
      -popupHeight / 2,
      popupWidth,
      popupHeight,
      32
    );
    bg.strokeRoundedRect(
      -popupWidth / 2,
      -popupHeight / 2,
      popupWidth,
      popupHeight,
      32
    );
    this.popup.add(bg);

    // Header (SlideDown)
    const headerContainer = this.scene.add
      .container(0, -popupHeight / 2 + 60)
      .setAlpha(0);
    this.popup.add(headerContainer);

    const icon = this.scene.add
      .text(0, -40, "", { fontSize: Math.round(popupHeight * 0.13) + "px" })
      .setOrigin(0.5);

    const title = this.scene.add
      .text(0, 20, "LEVEL UP!", {
        fontFamily: "Arial",
        fontSize: Math.round(popupHeight * 0.1) + "px",
        fontStyle: "bold",
        color: "#10b981",
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: title,
      y: "-=10",
      duration: 1000,
      repeat: -1,
      yoyo: true,
      ease: "Sine.inOut",
    });

    const subtitle = this.scene.add
      .text(0, 60, "스킬을 선택하여 능력을 강화하세요", {
        fontFamily: "Arial",
        fontSize: Math.round(popupHeight * 0.03) + "px",
        color: "#9aa3b2",
      })
      .setOrigin(0.5);

    headerContainer.add([icon, title, subtitle]);
    headerContainer.y -= 40;
    this.scene.tweens.add({
      targets: headerContainer,
      y: headerContainer.y + 40,
      alpha: 1,
      duration: 500,
      ease: "Power2",
    });

    // Skill Cards
    const gridY = popupHeight * 0.13;
    const gap = popupWidth * 0.32;

    this.skillContainers = [];

    this.skills.forEach((skill, index) => {
      const card = this.createSkillCard(skill, cardWidth, cardHeight);

      card.x = (index - 1) * gap;
      card.y = gridY + cardHeight / 2 + 40;

      this.popup.add(card);

      this.scene.tweens.add({
        targets: card,
        y: gridY,
        alpha: 1,
        duration: 500,
        ease: "Power3",
        delay: index * 120,
      });

      this.skillContainers.push(card);
    });
  }

  // Skill Card 생성 (비율 적용)
  createSkillCard(skill, cardWidth, cardHeight) {
    const card = this.scene.add.container(0, 0).setAlpha(0);

    // Card Background
    const bg = this.scene.add.graphics();
    const drawBg = (strokeWidth, strokeColor, strokeAlpha) => {
      bg.clear();
      bg.fillStyle(0x1a1d2e, 1);
      bg.lineStyle(strokeWidth, strokeColor, strokeAlpha);
      bg.fillRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        cardHeight * 0.05
      );
      bg.strokeRoundedRect(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight,
        cardHeight * 0.05
      );
    };

    drawBg(2, 0xffffff, 0.06);

    // Interactive zone
    bg.setInteractive(
      new Phaser.Geom.Rectangle(
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight
      ),
      Phaser.Geom.Rectangle.Contains
    )
      .on("pointerover", () => {
        drawBg(3, 0x10b981, 0.5);
        this.scene.tweens.add({ targets: card, scale: 1.05, duration: 120 });
      })
      .on("pointerout", () => {
        drawBg(2, 0xffffff, 0.06);
        this.scene.tweens.add({ targets: card, scale: 1, duration: 120 });
      })
      .on("pointerdown", () => {
        this.scene.tweens.add({
          targets: card,
          scale: 0.95,
          duration: 80,
          yoyo: true,
          onComplete: () => this.selectSkill(skill),
        });
      });

    // 아이콘
    const icon = this.scene.add
      .text(0, -cardHeight * 0.32, skill.icon, {
        fontSize: Math.round(cardHeight * 0.18) + "px",
      })
      .setOrigin(0.5);

    // 이름
    const name = this.scene.add
      .text(0, -cardHeight * 0.11, skill.name, {
        fontSize: Math.round(cardHeight * 0.07) + "px",
        fontStyle: "bold",
        color: "#e6eef8",
      })
      .setOrigin(0.5);

    // 설명
    const desc = this.scene.add
      .text(0, cardHeight * 0.05, skill.description, {
        fontSize: Math.round(cardHeight * 0.05) + "px",
        color: "#9aa3b2",
        align: "center",
        wordWrap: { width: cardWidth * 0.87 },
      })
      .setOrigin(0.5);

    // 스탯들
    let statY = cardHeight * 0.32;
    const stats = skill.stats.map((s) => {
      const stat = this.scene.add
        .text(0, statY, s, {
          fontSize: Math.round(cardHeight * 0.045) + "px",
          color: "#10b981",
          backgroundColor: "rgba(16,185,129,0.15)",
          padding: { left: 10, right: 10, top: 4, bottom: 4 },
        })
        .setOrigin(0.5);
      statY += cardHeight * 0.09;
      return stat;
    });

    card.add([bg, icon, name, desc, ...stats]);
    return card;
  }

  selectSkill(skill) {
    if (this.onSelect) this.onSelect(skill);
    this.closePopup();
  }

  closePopup() {
    this.scene.tweens.add({
      targets: [this.popup, this.overlay],
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.overlay.destroy();
        this.popup.destroy();
      },
    });
  }
}
