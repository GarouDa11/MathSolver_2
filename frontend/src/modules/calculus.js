import { f, FX, VAR } from '../lib/fields';
import { solveCalculus } from '../lib/api';

export default {
  id: 'v2', name: 'Module 2', sub: 'Calculus', calcs: [
    { id: 'diff', title: 'Differentiation', icon: 'd/dx', fields: [FX, VAR, f('order', 'Order', '1', '1')], run: v => solveCalculus('diff', v) },
    { id: 'second', title: 'Second Derivative', icon: 'f″', fields: [FX, VAR], run: v => solveCalculus('diff', { ...v, order: 2 }) },
    { id: 'partial', title: 'Partial Derivative', icon: '∂', fields: [f('expr', 'f(x, y, …)', 'x^2*y + sin(x*y)', 'x^2*y + sin(x*y)'), f('var', 'With respect to', 'y', 'y'), f('order', 'Order', '1', '1')], run: v => solveCalculus('diff', v) },
    { id: 'integration', title: 'Integration', icon: '∫', fields: [FX, VAR, f('a', 'Lower bound (optional)', '0'), f('b', 'Upper bound (optional)', '1')], run: v => solveCalculus('integrate', v) },
    { id: 'definite', title: 'Definite Integral', icon: '∫ₐᵇ', fields: [f('expr', 'f(x)', 'x^2', 'x^2'), VAR, f('a', 'From a', '0', '0'), f('b', 'To b', '3', '3')], run: v => solveCalculus('integrate', v) },
    { id: 'indefinite', title: 'Indefinite Integral', icon: '∫ dx', fields: [f('expr', 'f(x)', 'x^2 + 3x', 'x^2 + 3x'), VAR], run: v => solveCalculus('integrate', { ...v, a: '', b: '' }) },
    { id: 'limit', title: 'Limit', icon: 'lim', fields: [f('expr', 'f(x)', 'sin(x)/x', 'sin(x)/x'), VAR, f('point', 'x →', '0 (or oo)', '0'), f('dir', 'Direction', '', 'both', ['both', 'left', 'right'])], run: v => solveCalculus('limit', v) },
    { id: 'taylor', title: 'Taylor Series', icon: 'Tₙ', fields: [f('expr', 'f(x)', 'exp(x)', 'exp(x)'), VAR, f('point', 'Centered at a', '1', '1'), f('order', 'Up to degree n', '4', '4')], run: v => solveCalculus('taylor', v) },
    { id: 'maclaurin', title: 'Maclaurin Series', icon: 'M₀', fields: [f('expr', 'f(x)', 'cos(x)', 'cos(x)'), VAR, f('order', 'Up to degree n', '6', '6')], run: v => solveCalculus('taylor', { ...v, point: '0' }) },
    { id: 'gradient', title: 'Gradient', icon: '∇', fields: [f('expr', 'f(x, y, z)', 'x^2*y + z', 'x^2*y + z'), f('vars', 'Variables', 'x, y, z', 'x, y, z'), f('point', 'Evaluate at (optional)', 'x=1, y=2, z=3', 'x=1, y=2, z=3')], run: v => solveCalculus('gradient', v) },
  ],
};
