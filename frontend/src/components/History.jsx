import { useEffect, useState } from 'react';

function History({ ids, refresh }) {
  const [rows, setRows] = useState([]);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(setRows).catch(() => {}); }, [refresh]);
  const shown = rows.filter(r => ids.includes(r.module));
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="mb-3 text-sm font-semibold">Recent history</h3>
      {shown.length === 0 && <p className="text-sm text-slate-400">Nothing yet — run a calculation.</p>}
      <ul className="space-y-2 text-sm">
        {shown.slice(0, 6).map((r, i) => (
          <li key={i} className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-slate-500 truncate">{r.module}: {r.expression}</span>
            <span className="font-mono font-medium truncate max-w-[50%]">{r.result.split('\n')[0]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
