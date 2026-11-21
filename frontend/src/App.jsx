import { useEffect, useState } from 'react';
import { MODULES } from './modules';
import Calculator from './components/Calculator';
import History from './components/History';

function App() {
  const [modId, setModId] = useState('v1');
  const [calcId, setCalcId] = useState('basic');
  const [dark, setDark] = useState(matchMedia('(prefers-color-scheme: dark)').matches);
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);

  const mod = MODULES.find(m => m.id === modId);
  const calc = mod.calcs.find(c => c.id === calcId) || mod.calcs[0];
  const pickModule = m => { setModId(m.id); setCalcId(m.calcs[0].id); };

  return (
    <div className="flex h-full overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform lg:static lg:translate-x-0 ${open ? '' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h1 className="mb-4 text-lg font-bold">∑ MathSolver</h1>
          {/* Module toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {MODULES.map(m => (
              <button key={m.id} onClick={() => pickModule(m)}
                className={`rounded-lg px-2 py-2 text-left transition ${m.id === modId ? 'bg-white dark:bg-slate-950 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                <div className="text-xs font-semibold">{m.name}</div>
                <div className="text-[11px] opacity-80">{m.sub}</div>
              </button>
            ))}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mod.calcs.map(c => (
            <button key={c.id} onClick={() => { setCalcId(c.id); setOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${c.id === calc.id ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <span className="w-9 text-center text-xs font-semibold">{c.icon}</span><span>{c.title}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-500">
          <span>{mod.calcs.length} calculators</span>
          <button onClick={() => setDark(!dark)} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5">{dark ? '☀️' : '🌙'}</button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
          <button className="lg:hidden rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5" onClick={() => setOpen(!open)}>☰</button>
          <h2 className="text-xl font-bold">{calc.title}</h2>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">{mod.name} · {mod.sub}</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <Calculator key={calc.id} calc={calc} onDone={() => setTick(t => t + 1)} />
            <History ids={mod.calcs.map(c => c.id)} refresh={tick} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
