import { num, list, gcd, fact } from '../lib/mathUtils';
import { f } from '../lib/fields';

export default {
  id: 'v1', name: 'Module 1', sub: 'Core Math', calcs: [
    { id: 'basic', title: 'Basic Calculator', icon: '🧮', fields: [f('e', 'Expression', '(12 + 8) * 3 / 4', '(12+8)*3/4')],
      run: v => { if (!/^[\d+\-*/().%^ ]+$/.test(v.e)) throw new Error('Only numbers and + - * / ^ ( ) allowed');
        return String(Function(`return (${v.e.replace(/\^/g, '**')})`)()); } },
    { id: 'percentage', title: 'Percentage', icon: '％', fields: [f('p', 'What is (%)', '15', '15'), f('n', 'of', '200', '200')],
      run: v => `${v.p}% of ${v.n} = ${num(v.p, 'Percent') * num(v.n, 'Number') / 100}` },
    { id: 'fraction', title: 'Fraction', icon: '➗', fields: [f('a', 'Numerator 1', '', '1'), f('b', 'Denominator 1', '', '2'),
      f('op', 'Operation', '', '+', ['+', '-', '×', '÷']), f('c', 'Numerator 2', '', '1'), f('d', 'Denominator 2', '', '3')],
      run: v => { const [a, b, c, d] = ['a', 'b', 'c', 'd'].map(k => num(v[k], k));
        let [n, m] = { '+': [a*d + c*b, b*d], '-': [a*d - c*b, b*d], '×': [a*c, b*d], '÷': [a*d, b*c] }[v.op];
        if (!m) throw new Error('Denominator is zero');
        const g = gcd(n, m) || 1; n /= g; m /= g; if (m < 0) { n = -n; m = -m; }
        return `${n}/${m}  =  ${(n / m).toFixed(6)}`; } },
    { id: 'ratio', title: 'Ratio', icon: '⚖️', fields: [f('a', 'A', '', '12'), f('b', 'B', '', '18')],
      run: v => { const a = num(v.a, 'A'), b = num(v.b, 'B'), g = gcd(a, b) || 1; return `${a / g} : ${b / g}`; } },
    { id: 'average', title: 'Average / Mean', icon: '📊', fields: [f('l', 'Numbers (comma separated)', '4, 8, 15, 16', '4, 8, 15, 16, 23, 42')],
      run: v => { const a = list(v.l).sort((x, y) => x - y), n = a.length, sum = a.reduce((s, x) => s + x, 0);
        const cnt = {}; a.forEach(x => cnt[x] = (cnt[x] || 0) + 1); const top = Math.max(...Object.values(cnt));
        const mode = Object.keys(cnt).filter(k => cnt[k] === top);
        return `Count: ${n}\nSum: ${sum}\nMean: ${sum / n}\nMedian: ${n % 2 ? a[(n-1)/2] : (a[n/2-1] + a[n/2]) / 2}\nMode: ${top > 1 ? mode.join(', ') : 'none'}\nRange: ${a[n-1] - a[0]}`; } },
    { id: 'quadratic', title: 'Quadratic Equation', icon: '📐', fields: [f('a', 'a', '', '1'), f('b', 'b', '', '-3'), f('c', 'c', '', '2')],
      run: v => { const a = num(v.a, 'a'), b = num(v.b, 'b'), c = num(v.c, 'c'); if (!a) throw new Error('a cannot be 0');
        const D = b*b - 4*a*c, s = Math.sqrt(Math.abs(D)) / (2*a), m = -b / (2*a);
        return `Discriminant = ${D}\n` + (D >= 0 ? `x₁ = ${m + s}\nx₂ = ${m - s}` : `x₁ = ${m} + ${Math.abs(s)}i\nx₂ = ${m} − ${Math.abs(s)}i`); } },
    { id: 'factorial', title: 'Factorial & Permutations', icon: '❗', fields: [f('n', 'n', '', '6'), f('r', 'r', '', '2')],
      run: v => { const n = num(v.n, 'n'), r = num(v.r, 'r'); if (n < 0 || r < 0 || r > n || n > 500) throw new Error('Need 0 ≤ r ≤ n ≤ 500');
        return `n! = ${fact(n)}\nP(n,r) = ${fact(n) / fact(n - r)}\nC(n,r) = ${fact(n) / (fact(r) * fact(n - r))}`; } },
    { id: 'prime', title: 'Prime Checker', icon: '🔢', fields: [f('n', 'Integer', '', '97')],
      run: v => { let n = num(v.n, 'Number'); if (!Number.isInteger(n) || n < 2) throw new Error('Enter an integer ≥ 2');
        const o = n, fs = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { fs.push(p); n /= p; } if (n > 1) fs.push(n);
        return fs.length === 1 ? `${o} is PRIME` : `${o} is NOT prime\n${o} = ${fs.join(' × ')}`; } },
    { id: 'gcd', title: 'GCD / LCM', icon: '🔗', fields: [f('l', 'Numbers (comma separated)', '12, 18, 24', '12, 18, 24')],
      run: v => { const a = list(v.l); return `GCD = ${a.reduce(gcd)}\nLCM = ${a.reduce((x, y) => x * y / gcd(x, y))}`; } },
  ],
};
