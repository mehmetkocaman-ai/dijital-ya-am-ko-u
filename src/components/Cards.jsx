const DailyStreakCard = window.DailyStreakCard = ({ streak }) => (
  <div className="rounded-[1.5rem] bg-orange-100 px-5 py-4 shadow-[0_8px_0_#fdba74]"><p className="text-sm font-black text-orange-600">🔥 Günlük seri</p><p className="text-3xl font-black text-orange-700">{streak} gün</p></div>
);
const CoinCard = window.CoinCard = ({ coins }) => (
  <div className="rounded-[1.5rem] bg-yellow-100 px-5 py-4 shadow-[0_8px_0_#fde047] sm:col-span-2"><p className="text-sm font-black text-yellow-600">🪙 Toplam coin</p><p className="text-3xl font-black text-yellow-700">{coins}</p></div>
);
const LevelCard = window.LevelCard = ({ level, xpInLevel, progress }) => (
  <section className="rounded-[2rem] border-4 border-white bg-slate-900 p-6 text-white shadow-[0_14px_0_#b7d8ad]"><p className="text-sm font-black uppercase tracking-[0.2em] text-lime-300">Seviye</p><div className="mt-3 flex items-end justify-between"><span className="text-7xl font-black">{level}</span><span className="rounded-full bg-lime-400 px-4 py-2 text-sm font-black text-slate-900">{100 - xpInLevel} XP kaldı</span></div><div className="mt-6 h-5 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-3 text-sm font-bold text-slate-300">Sonraki seviyeye ilerleme: %{progress}</p></section>
);
