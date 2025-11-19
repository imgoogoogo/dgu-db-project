import SkillPopup from "./popup/SkillPopup.js";

export default class PopupScene extends Phaser.Scene {
  constructor() {
    super("PopupScene");
  }
  preload() {}

  create() {
    // 예시: 스킬 팝업 열기
    const skills = [
      {
        icon: "🔥",
        name: "화염 폭발",
        description: "주변 적에게 강력한 화염 피해를 입힙니다.",
        stats: ["+50% 공격력", "범위 +30%"],
        rarity: "epic",
      },
      {
        icon: "❄️",
        name: "빙결의 오라",
        description: "적의 이동 속도를 느리게 하고 얼립니다.",
        stats: ["속도 -40%", "빙결 15%"],
        rarity: "rare",
      },
      {
        icon: "💉",
        name: "생명력 흡수",
        description: "피해량 일부를 체력으로 회복합니다.",
        stats: ["흡혈 20%", "최대 HP +10"],
        rarity: "legendary",
      },
    ];

    new SkillPopup(this, skills, (skill) => {
      console.log("선택한 스킬:", skill);
      this.scene.resume("PlayScene");
      this.scene.stop("PopupScene");

      //this.scene.scene.resume("PlayScene");
    });
  }
}
