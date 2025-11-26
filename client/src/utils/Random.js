export default function getRandomMonsterByChance(monsters) {
  // 1. 전체 확률 합 계산
  const totalChance = monsters.reduce((sum, m) => sum + (m.chance || 0), 0);

  // 2. 예외 처리: chance 합이 0이면 랜덤 선택
  if (totalChance <= 0) {
    return monsters[Math.floor(Math.random() * monsters.length)];
  }

  // 3. 0~totalChance 범위 난수 생성
  let rand = Math.random() * totalChance;

  // 4. cumulative 방식으로 선택
  let cumulative = 0;
  for (const monster of monsters) {
    cumulative += monster.chance || 0;
    if (rand <= cumulative) {
      console.log("Selected Monster:", monster);
      return monster;
    }
  }

  // 5. floating error 대비 fallback
  return monsters[monsters.length - 1];
}
