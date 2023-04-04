export function getRandomArray(a, b, m) {
  const result = [];
  while (result.length < m) {
    const randomNum = Math.floor(Math.random() * (b - a + 1) + a);
    if (!result.includes(randomNum)) {
      result.push(randomNum);
    }
  }
  return result;
}
