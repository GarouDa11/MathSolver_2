// Helper for declaring calculator input fields
export const f = (k, label, ph = '', def = '', options) => ({ k, label, ph, def, options });
export const FX = f('expr', 'f(x)', 'x^3 * sin(2x)', 'x^3*sin(2x)');
export const VAR = f('var', 'Variable', 'x', 'x');
