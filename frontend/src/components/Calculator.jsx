import { useState } from 'react';
import { post } from '../lib/api';

const input = 'w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

function Calculator({ calc, onDone }) {
  const [vals, setVals] = useState(() => Object.fromEntries(calc.fields.map(x => [x.k, x.def])));
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const result = String(await calc.run(vals));
      setOut({ ok: true, text: result });
      const expression = calc.fields.map(x => vals[x.k]).filter(Boolean).join(' | ');
      post('/api/save', { module: calc.id, expression, result }).then(onDone).catch(() => {});
    } catch (err) { setOut({ ok: false, text: err.message || 'Something went wrong' }); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {calc.fields.map(x => (
          <label key={x.k} className={`block text-sm font-medium ${x.k === 'expr' || x.k === 'e' || x.k === 'l' ? 'sm:col-span-2' : ''}`}>
            <span className="mb-1 block text-slate-600 dark:text-slate-400">{x.label}</span>
            {x.options
              ? <select className={input} value={vals[x.k]} onChange={e => setVals({ ...vals, [x.k]: e.target.value })}>{x.options.map(o => <option key={o}>{o}</option>)}</select>
              : <input className={input} placeholder={x.ph} value={vals[x.k]} onChange={e => setVals({ ...vals, [x.k]: e.target.value })} />}
          </label>
        ))}
      </div>
      <button disabled={busy} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
        {busy ? 'Calculating…' : 'Calculate'}
      </button>
      {out && (
        <div className={`rounded-xl p-4 ${out.ok ? 'bg-indigo-50 dark:bg-indigo-950/40' : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'}`}>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">{out.text}</pre>
          {out.ok && <button type="button" onClick={() => navigator.clipboard.writeText(out.text)} className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">Copy result</button>}
        </div>
      )}
    </form>
  );
}

export default Calculator;
