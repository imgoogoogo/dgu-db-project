export default function getRandomMonsterByChance(monsters) {
  // chance 합계 구하기
  const totalChance = monsters.reduce((sum, m) => sum + (m.chance || 0), 0);
  const rand = Math.random() * totalChance;
  let acc = 0;
  for (const monster of monsters) {
    acc += monster.chance || 0;
    if (rand < acc) return monster;
  }
  // 혹시나 chance가 0인 경우 대비
  return monsters[monsters.length - 1];
}
