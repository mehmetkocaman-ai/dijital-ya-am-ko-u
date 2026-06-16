const { useEffect, useMemo, useState } = React;
const { createRoot } = ReactDOM;

const STORAGE_KEY = 'dijital-yasam-kocu-state';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dailyTasks = [
  { id: 1, title: 'Sabah 10 dakika esneme yap', category: 'Beden', xp: 25, icon: '🌞' },
  { id: 2, title: 'Bildirimleri 1 saat sessize al', category: 'Odak', xp: 35, icon: '🎧' },
  { id: 3, title: '15 dakika kitap oku', category: 'Zihin', xp: 30, icon: '📚' },
  { id: 4, title: 'Bir bardak su iç ve nefes molası ver', category: 'Enerji', xp: 20, icon: '💧' },
  { id: 5, title: 'Günün dijital ekran süresini not et', category: 'Farkındalık', xp: 40, icon: '📱' },
];

const todayKey = () => new Date().toLocaleDateString('en-CA');

const dayDifference = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;

  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);

  return Math.round((to - from) / MS_PER_DAY);
};

const normalizeStoredState = () => {
  const emptyState = {
    userName: '',
    completedTasks: [],
    completedDate: todayKey(),
    streak: 0,
    bestStreak: 0,
    lastCompletionDate: '',
  };

  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

  if (!savedState) return emptyState;

  const today = todayKey();
  const missedDays = dayDifference(savedState.lastCompletionDate, today);
  const isNewDay = savedState.completedDate !== today;

  return {
    ...emptyState,
    ...savedState,
    completedTasks: isNewDay ? [] : savedState.completedTasks || [],
    completedDate: today,
    streak: missedDays > 1 ? 0 : savedState.streak || 0,
    bestStreak: savedState.bestStreak || 0,
  };
};

function App() {
  const [coachState, setCoachState] = useState(normalizeStoredState);
  const { userName, completedTasks, streak, bestStreak, lastCompletionDate } = coachState;
  const today = todayKey();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coachState));
  }, [coachState]);

  const totalXp = useMemo(
    () => dailyTasks.filter((task) => completedTasks.includes(task.id)).reduce((sum, task) => sum + task.xp, 0),
    [completedTasks]
  );

  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;
  const progress = Math.min(xpInLevel, 100);
  const completedCount = completedTasks.length;
  const streakProgress = Math.min((streak / 7) * 100, 100);

  const updateUserName = (value) => {
    setCoachState((current) => ({ ...current, userName: value }));
  };

  const toggleTask = (taskId) => {
    setCoachState((current) => {
      const taskAlreadyCompleted = current.completedTasks.includes(taskId);
      const nextCompletedTasks = taskAlreadyCompleted
        ? current.completedTasks.filter((id) => id !== taskId)
        : [...current.completedTasks, taskId];
      const isFirstCompletionToday = !taskAlreadyCompleted && current.lastCompletionDate !== today;
      const continuedStreak = dayDifference(current.lastCompletionDate, today) === 1;
      const nextStreak = isFirstCompletionToday ? (continuedStreak ? current.streak + 1 : 1) : current.streak;

      return {
        ...current,
        completedTasks: nextCompletedTasks,
        completedDate: today,
        lastCompletionDate: isFirstCompletionToday ? today : current.lastCompletionDate,
        streak: nextStreak,
        bestStreak: Math.max(current.bestStreak, nextStreak),
      };
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5fff2] text-slate-900">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-10">
        <div className="absolute left-[-80px] top-[-120px] h-72 w-72 rounded-full bg-lime-300/40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />

        <header className="relative z-10 flex flex-col gap-5 rounded-[2rem] border-4 border-white bg-white/85 p-6 shadow-[0_18px_0_#d7f5c9] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-lime-100 px-4 py-2 text-sm font-extrabold text-lime-700">
              Dijital Yaşam Koçu
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Merhaba {userName || 'Koçluk Yolcusu'}!
            </h1>
            <p className="mt-3 max-w-2xl text-lg font-semibold text-slate-500">
              Bugün küçük alışkanlıkları tamamla, XP kazan ve dijital dengen için seviye atla.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px]">
            <div className="rounded-[1.5rem] bg-orange-100 px-5 py-4 shadow-[0_8px_0_#fdba74]">
              <p className="text-sm font-black text-orange-600">🔥 Günlük seri</p>
              <p className="text-3xl font-black text-orange-700">{streak} gün</p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-black text-slate-500">
              Kullanıcı adın
              <input
                value={userName}
                onChange={(event) => updateUserName(event.target.value)}
                placeholder="Örn. Ayşe"
                className="rounded-2xl border-4 border-slate-100 bg-white px-5 py-4 text-lg font-extrabold text-slate-800 outline-none transition focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
              />
            </label>
          </div>
        </header>

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border-4 border-white bg-white p-5 shadow-[0_14px_0_#dcefd4] md:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black">Günlük görevler</h2>
                <p className="font-bold text-slate-400">{completedCount}/{dailyTasks.length} görev tamamlandı</p>
              </div>
              <span className="rounded-2xl bg-yellow-100 px-4 py-3 text-xl font-black text-yellow-600">⚡ {totalXp} XP</span>
            </div>

            <div className="space-y-4">
              {dailyTasks.map((task) => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <article
                    key={task.id}
                    className={`flex items-center gap-4 rounded-[1.5rem] border-4 p-4 transition ${
                      isDone
                        ? 'border-lime-300 bg-lime-50 shadow-[0_8px_0_#bef264]'
                        : 'border-slate-100 bg-white shadow-[0_8px_0_#e5e7eb] hover:-translate-y-1 hover:border-lime-200'
                    }`}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-3xl">{task.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-lg font-black ${isDone ? 'text-lime-700 line-through decoration-4' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      <p className="text-sm font-extrabold text-slate-400">{task.category} • +{task.xp} XP</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`${task.title} görevini tamamla`}
                      className="h-8 w-8 cursor-pointer accent-lime-500"
                    />
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border-4 border-white bg-slate-900 p-6 text-white shadow-[0_14px_0_#b7d8ad]">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-lime-300">Seviye</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-7xl font-black">{level}</span>
                <span className="rounded-full bg-lime-400 px-4 py-2 text-sm font-black text-slate-900">{100 - xpInLevel} XP kaldı</span>
              </div>
              <div className="mt-6 h-5 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-300">Sonraki seviyeye ilerleme: %{progress}</p>
            </section>

            <section className="rounded-[2rem] border-4 border-white bg-gradient-to-br from-orange-50 to-yellow-100 p-6 shadow-[0_14px_0_#fed7aa]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Seri takibi</p>
                  <h2 className="mt-2 text-3xl font-black text-orange-700">🔥 {streak} gün</h2>
                </div>
                <div className="rounded-3xl bg-white px-4 py-3 text-center shadow-[0_6px_0_#fdba74]">
                  <p className="text-xs font-black text-slate-400">En iyi</p>
                  <p className="text-2xl font-black text-slate-800">{bestStreak}</p>
                </div>
              </div>
              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400 transition-all" style={{ width: `${streakProgress}%` }} />
              </div>
              <p className="mt-3 text-sm font-extrabold text-orange-700">
                {lastCompletionDate === today
                  ? 'Harika! Bugünkü seri hedefin tamamlandı.'
                  : 'Bugün en az bir görevi tamamla, serin büyüsün.'}
              </p>
            </section>

            <section className="rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_14px_0_#dcefd4]">
              <h2 className="text-2xl font-black">Koç notu</h2>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
                Duolingo tarzı seri hissi için her gün en az 1 görevi tamamla. Bir günü boş geçirirsen seri sıfırlanır, en iyi serin ise saklanır.
              </p>
              <div className="mt-5 rounded-3xl bg-lime-100 p-5 text-center text-5xl">🦉</div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
