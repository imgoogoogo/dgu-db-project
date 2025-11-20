export default function getRandomElement(arr) {
  const rand = Math.random() * 100;
  let acc = 0;
  let selected = arr[0]; // 기본값

  for (const a of arr) {
    acc += a.chance;
    if (rand < acc) {
      selected = a;
      break;
    }
  }
  return selected;
}
