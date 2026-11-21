import sqlite3

from flask import Flask, jsonify, request
from sympy import E, Integral, N, Symbol, diff, integrate, limit, oo, pi, series
from sympy.parsing.sympy_parser import (convert_xor, implicit_multiplication_application,
                                        parse_expr, standard_transformations)

app = Flask(__name__)
DB = 'math_history.db'


# ───────────── Database ─────────────
def db():
    return sqlite3.connect(DB)


def init_db():
    with db() as c:
        c.execute('''CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            module TEXT NOT NULL,
            expression TEXT NOT NULL,
            result TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')


# ───────────── Calculus engine (SymPy) ─────────────
TRANSFORMS = standard_transformations + (implicit_multiplication_application, convert_xor)
CONSTANTS = {'e': E, 'pi': pi, 'inf': oo, 'oo': oo, 'ln': __import__('sympy').log}


def parse(text):
    text = (text or '').strip()
    if not text or '__' in text:
        raise ValueError('Please enter a valid expression')
    return parse_expr(text, local_dict=CONSTANTS, transformations=TRANSFORMS)


def fmt(expr):
    return str(expr).replace('**', '^')


def finish(r, suffix=''):
    if r.has(Integral):
        raise ValueError('No closed-form answer found for this expression')
    out = fmt(r) + suffix
    if r.is_number and not r.is_Integer and r.is_finite:
        out += f'\n≈ {N(r, 10)}'
    return out


def solve(op, d):
    f = parse(d.get('expr'))
    x = Symbol((d.get('var') or 'x').strip())

    if op == 'diff':
        return finish(diff(f, x, int(d.get('order') or 1)))

    if op == 'integrate':
        a, b = d.get('a'), d.get('b')
        if a not in (None, '') and b not in (None, ''):
            return finish(integrate(f, (x, parse(a), parse(b))))
        return finish(integrate(f, x), ' + C')

    if op == 'limit':
        direction = {'both': '+-', 'right': '+', 'left': '-'}[d.get('dir') or 'both']
        return finish(limit(f, x, parse(d.get('point') or '0'), direction))

    if op == 'taylor':
        n = int(d.get('order') or 5)
        return finish(series(f, x, parse(d.get('point') or '0'), n + 1).removeO())

    if op == 'gradient':
        names = [v.strip() for v in (d.get('vars') or 'x,y').split(',') if v.strip()]
        grads = [diff(f, Symbol(v)) for v in names]
        lines = [f'∂f/∂{v} = {fmt(g)}' for v, g in zip(names, grads)]
        pt = (d.get('point') or '').strip()
        if pt:
            subs = {Symbol(k.strip()): parse(v) for k, v in (p.split('=') for p in pt.split(','))}
            lines.append('At (' + pt + '): ∇f = [' + ', '.join(fmt(g.subs(subs)) for g in grads) + ']')
        return '\n'.join(lines)

    raise ValueError('Unknown operation')


# ───────────── Routes ─────────────
@app.route('/')
def index():
    return 'MathSolver API is running. Open the React app at http://localhost:5173'


@app.route('/api/calculus', methods=['POST'])
def calculus():
    data = request.json or {}
    try:
        return jsonify({'result': solve(data.get('op'), data)})
    except Exception as e:  # bad input → friendly message, not a 500
        return jsonify({'error': str(e)[:200]}), 400


@app.route('/api/save', methods=['POST'])
def save_calculation():
    d = request.json or {}
    with db() as c:
        c.execute('INSERT INTO calculations (module, expression, result) VALUES (?, ?, ?)',
                  (d.get('module', 'basic'), d.get('expression'), str(d.get('result'))))
    return jsonify({'status': 'success'})


@app.route('/api/history')
def get_history():
    with db() as c:
        rows = c.execute('SELECT module, expression, result, timestamp FROM calculations '
                         'ORDER BY id DESC LIMIT 20').fetchall()
    return jsonify([dict(zip(('module', 'expression', 'result', 'timestamp'), r)) for r in rows])


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
