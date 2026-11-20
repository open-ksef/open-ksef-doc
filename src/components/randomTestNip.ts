const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
const ksefNipPattern = /^[1-9]((\d[1-9])|([1-9]\d))\d{7}$/;

export function randomTestNip(): string {
  const values = new Uint32Array(9);
  for (;;) {
    crypto.getRandomValues(values);
    const digits = Array.from(values, (v) => v % 10);
    const check = digits.reduce((sum, d, i) => sum + d * weights[i], 0) % 11;
    if (check === 10) continue;
    const nip = digits.join('') + check;
    if (ksefNipPattern.test(nip)) return nip;
  }
}
