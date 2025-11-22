import SkillPopup from "../ui/SkillPopup.js";

export default class PopupScene extends Phaser.Scene {
  constructor() {
    super("PopupScene");
  }
  preload() {}

  create() {
    // 예시: 스킬 팝업 열기
    const skills = [
      {
        icon: "🔫",
        name: "탄환 강화",
        description: "공격 시 발사되는 총알이 1개 추가로 발사됩니다.",
        stats: ["총알 +1"],
        rarity: "rare",
      },
      {
        icon: "💉",
        name: "생명력 흡수",
        description: "적에게 입힌 피해의 일부를 체력으로 전환합니다.",
        stats: ["흡혈 5%"],
        rarity: "legendary",
      },
      {
        icon: "⚡",
        name: "속도 폭주",
        description: "플레이어의 이동 속도를 증가시킵니다.",
        stats: ["이동 속도 +5%"],
      },
      {
        icon: "🎯",
        name: "정밀 사격",
        description: "몬스터한테 총알이 적중할 확률이 증가합니다.",
        stats: ["적중 확률 +12%"],
      },
      {
        icon: "💥",
        name: "타격 강화",
        description: "적중 시 추가 타격이 발생합니다.",
        stats: ["추가 타격 +1"],
      },
    ];

    const randomSkills = Phaser.Utils.Array.Shuffle([...skills]).slice(0, 3);

    new SkillPopup(this, randomSkills, (selectedSkill) => {
      this.applySkill(selectedSkill);
      this.scene.resume("PlayScene");
      this.scene.stop("PopupScene");
    });
  }

  applySkill(skill) {
    const playScene = this.scene.get("PlayScene");
    if (playScene && playScene.player) {
      switch (skill.name) {
        case "탄환 강화":
          playScene.player.bulletCount =
            (playScene.player.bulletCount || 1) + 1;
          playScene.skillWindow.increaseSkillLevel(0);
          break;
        case "생명력 흡수":
          playScene.skillWindow.increaseSkillLevel(1);
          break;
        case "속도 폭주":
          playScene.gameData.addState(
            "player.speed",
            (playScene.player.speed || 200) * 0.05
          );
          playScene.skillWindow.increaseSkillLevel(2);
          break;
        case "정밀 사격":
          playScene.player.critChance =
            (playScene.player.critChance || 0) + 0.12;
          playScene.player.critDamage =
            (playScene.player.critDamage || 1) + 0.3;
          playScene.skillWindow.increaseSkillLevel(3);
          break;
        case "타격 강화":
          playScene.skillWindow.increaseSkillLevel(4);
          break;
      }
    }
  }
}
