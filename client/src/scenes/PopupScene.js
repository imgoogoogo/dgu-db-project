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
        stats: ["총알 +1", "공격 효율 증가"],
        rarity: "rare",
      },
      {
        icon: "💉",
        name: "생명력 흡수",
        description: "적에게 입힌 피해의 일부를 체력으로 전환합니다.",
        stats: ["흡혈 20%", "최대 HP +10"],
        rarity: "legendary",
      },
      {
        icon: "⚡",
        name: "속도 폭주",
        description: "플레이어의 이동 속도를 증가시킵니다.",
        stats: ["이동 속도 +25%", "대시 반응 속도 증가"],
      },
      {
        icon: "🎯",
        name: "정밀 사격",
        description: "공격이 일정 확률로 치명타로 적용됩니다.",
        stats: ["치명타 확률 +12%", "치명타 피해 +30%"],
      },
      {
        icon: "💥",
        name: "광역 타격",
        description: "일부 공격이 주변 적에게 추가 피해를 입힙니다.",
        stats: ["광역 범위 15%", "주변 적 피해 50%"],
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
          break;
        case "생명력 흡수":
          playScene.player.hp = (playScene.player.hp || 100) + 10;
          playScene.player.lifeSteal = (playScene.player.lifeSteal || 0) + 0.2;
          break;
        case "속도 폭주":
          playScene.player.speed = (playScene.player.speed || 200) * 1.25;
          break;
        case "정밀 사격":
          playScene.player.critChance =
            (playScene.player.critChance || 0) + 0.12;
          playScene.player.critDamage =
            (playScene.player.critDamage || 1) + 0.3;
          break;
        case "광역 타격":
          playScene.player.areaDamage =
            (playScene.player.areaDamage || 0) + 0.5;
          playScene.player.areaRange = (playScene.player.areaRange || 0) + 0.15;
          break;
      }
    }
  }
}
