export const num = (v, label) => {
  const x = Number(v);
  if (String(v).trim() === '' || isNaN(x)) throw new Error(`${label} must be a number`);
  return x;
};
export const list = s => s.split(/[,\s]+/).filter(Boolean).map(v => num(v, `"${v}"`));
export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fact = n => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
