const App = window.App = () => {
  const store = useCoachStore();
  const { coachState } = store;
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5fff2] text-slate-900">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-10">
        {store.focusCelebration && <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 animate-[focus-celebrate_2.6s_ease-out_forwards] rounded-[2rem] border-4 border-white bg-lime-100 px-8 py-5 text-center font-black text-lime-800 shadow-[0_14px_0_#84cc16]"><p className="text-4xl">🎉</p><p className="text-2xl">Odak seansı tamamlandı!</p><p className="text-sm">+{store.focusCelebration.xp} XP • 🪙 +{store.focusCelebration.coins} coin • {store.focusCelebration.minutes} dk</p></div>}
        {store.coinToast && <div key={store.coinToast.id} className="fixed right-5 top-5 z-50 animate-[coin-pop_1.8s_ease-out_forwards] rounded-full border-4 border-white bg-yellow-100 px-5 py-3 text-xl font-black text-yellow-700 shadow-[0_8px_0_#facc15]">🪙 +{store.coinToast.amount} coin kazandın!</div>}
        <div className="absolute left-[-80px] top-[-120px] h-72 w-72 rounded-full bg-lime-300/40 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
        <Header userName={coachState.userName} updateUserName={store.updateUserName} streak={coachState.streak} coins={coachState.coins} />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <CategoryCardsSection tasks={coachState.tasks} activeCategory={store.activeCategory} setActiveCategory={store.setActiveCategory} selectedCategoryName={store.selectedCategoryName} />
          <TasksSection store={store} />
          <GoalsSection store={store} />
          <FocusSection store={store} />
          <StatisticsSection store={store} />
          <BadgesSection unlockedBadges={coachState.unlockedBadges} lifetimeXp={coachState.lifetimeXp} />
          <Sidebar store={store} />
        </div>
      </section>
    </main>
  );
};
