const { useEffect, useMemo, useRef, useState } = React;

const useCoachStore = window.useCoachStore = () => {
  const [coachState, setCoachState] = useState(normalizeStoredState);
  const [coinToast, setCoinToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('tum');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', category: 'fitness', xp: 20, coins: 5, difficulty: 'Kolay' });
  const [goalForm, setGoalForm] = useState({ title: '', description: '', category: 'fitness', type: 'gunluk', targetValue: 5, currentProgress: 0, startDate: todayKey(), endDate: todayKey() });
  const [selectedFocusMinutes, setSelectedFocusMinutes] = useState(25);
  const [remainingFocusSeconds, setRemainingFocusSeconds] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusCelebration, setFocusCelebration] = useState(null);
  const xpChartRef = useRef(null);
  const taskChartRef = useRef(null);
  const focusChartRef = useRef(null);
  const today = todayKey();
  const { completedTasks, tasks, lifetimeXp, unlockedBadges, dailyFocusHistory, goals } = coachState;

  useEffect(() => saveState(coachState), [coachState]);
  useEffect(() => {
    if (!coinToast) return undefined;
    const timeout = setTimeout(() => setCoinToast(null), 1800);
    return () => clearTimeout(timeout);
  }, [coinToast]);
  useEffect(() => {
    setRemainingFocusSeconds(selectedFocusMinutes * 60);
    setIsFocusRunning(false);
  }, [selectedFocusMinutes]);
  useEffect(() => {
    if (!isFocusRunning) return undefined;
    const interval = setInterval(() => setRemainingFocusSeconds((current) => Math.max(current - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [isFocusRunning]);
  useEffect(() => {
    if (!isFocusRunning || remainingFocusSeconds !== 0) return;
    completeFocusSession();
  }, [isFocusRunning, remainingFocusSeconds]);
  useEffect(() => {
    if (!focusCelebration) return undefined;
    const timeout = setTimeout(() => setFocusCelebration(null), 2600);
    return () => clearTimeout(timeout);
  }, [focusCelebration]);

  const totalXp = useMemo(() => tasks.filter((task) => completedTasks.includes(task.id)).reduce((sum, task) => sum + task.xp, 0), [completedTasks, tasks]);
  const level = Math.floor(lifetimeXp / 100) + 1;
  const xpInLevel = lifetimeXp % 100;
  const progress = Math.min(xpInLevel, 100);
  const unlockedBadgeCount = unlockedBadges.length;
  const filteredTasks = activeCategory === 'tum' ? tasks : tasks.filter((task) => task.category === activeCategory);
  const selectedCategoryName = activeCategory === 'tum' ? 'Tüm görevler' : getCategory(activeCategory)?.name;
  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);
  const goalSuccessRate = goals.length ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  const lastSevenDays = useMemo(getLastSevenDays, [completedTasks, lifetimeXp]);
  const weeklyStats = useMemo(() => {
    const dailyRows = lastSevenDays.map((date) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('tr-TR', { weekday: 'short' }),
      xp: coachState.dailyHistory[date]?.xp || 0,
      tasks: coachState.dailyHistory[date]?.tasks || 0,
      focusMinutes: dailyFocusHistory[date]?.minutes || 0,
    }));
    const completedThisWeek = dailyRows.reduce((sum, day) => sum + day.tasks, 0);
    const achievement = Math.round((completedThisWeek / (Math.max(tasks.length, 1) * 7)) * 100);
    const productiveDay = dailyRows.reduce((best, day) => (day.xp > best.xp ? day : best), dailyRows[0]);
    return { dailyRows, completedThisWeek, achievement, productiveDay };
  }, [coachState.dailyHistory, dailyFocusHistory, lastSevenDays, tasks.length]);

  useEffect(() => {
    if (!window.Chart || !xpChartRef.current || !taskChartRef.current || !focusChartRef.current) return undefined;
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1f2937', titleColor: '#bef264', bodyColor: '#ffffff', cornerRadius: 14, padding: 12 } }, scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: '800' } } }, y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b', precision: 0 } } } };
    const labels = weeklyStats.dailyRows.map((day) => day.label);
    const xpChart = new Chart(xpChartRef.current, { type: 'bar', data: { labels, datasets: [{ label: 'XP', data: weeklyStats.dailyRows.map((day) => day.xp), backgroundColor: '#a3e635', borderColor: '#65a30d', borderRadius: 14, borderWidth: 2 }] }, options: chartOptions });
    const taskChart = new Chart(taskChartRef.current, { type: 'line', data: { labels, datasets: [{ label: 'Görev', data: weeklyStats.dailyRows.map((day) => day.tasks), borderColor: '#fb923c', backgroundColor: 'rgba(251, 146, 60, 0.18)', pointBackgroundColor: '#f97316', pointBorderColor: '#ffffff', pointBorderWidth: 3, pointRadius: 6, fill: true, tension: 0.35 }] }, options: chartOptions });
    const focusChart = new Chart(focusChartRef.current, { type: 'bar', data: { labels, datasets: [{ label: 'Odak dk', data: weeklyStats.dailyRows.map((day) => day.focusMinutes), backgroundColor: '#38bdf8', borderColor: '#0284c7', borderRadius: 14, borderWidth: 2 }] }, options: chartOptions });
    return () => { xpChart.destroy(); taskChart.destroy(); focusChart.destroy(); };
  }, [weeklyStats]);

  const updateUserName = (value) => setCoachState((current) => ({ ...current, userName: value }));
  const resetTaskForm = () => { setEditingTaskId(null); setTaskForm({ title: '', description: '', category: 'fitness', xp: 20, coins: 5, difficulty: 'Kolay' }); };
  const saveTask = (event) => {
    event.preventDefault();
    const normalizedTask = { ...taskForm, title: taskForm.title.trim(), description: taskForm.description.trim(), xp: Math.max(Number(taskForm.xp), 0), coins: Math.max(Number(taskForm.coins), 0) };
    if (!normalizedTask.title) return;
    setCoachState((current) => ({ ...current, tasks: editingTaskId ? current.tasks.map((task) => (task.id === editingTaskId ? { ...task, ...normalizedTask } : task)) : [...current.tasks, { id: createTaskId(), ...normalizedTask }] }));
    resetTaskForm();
  };
  const editTask = (task) => { setEditingTaskId(task.id); setTaskForm({ title: task.title, description: task.description, category: task.category, xp: task.xp, coins: task.coins, difficulty: task.difficulty }); };
  const deleteTask = (taskId) => setCoachState((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== taskId), completedTasks: current.completedTasks.filter((id) => id !== taskId) }));
  const toggleTask = (taskId) => {
    setCoachState((current) => {
      const taskAlreadyCompleted = current.completedTasks.includes(taskId);
      const completedTask = current.tasks.find((task) => task.id === taskId);
      if (!completedTask) return current;
      const awardKey = `${today}:${taskId}`;
      const shouldAwardXp = !taskAlreadyCompleted && !current.awardedXpTasks.includes(awardKey);
      const nextCompletedTasks = taskAlreadyCompleted ? current.completedTasks.filter((id) => id !== taskId) : [...current.completedTasks, taskId];
      const nextStreak = !taskAlreadyCompleted && current.lastCompletionDate !== today ? (dayDifference(current.lastCompletionDate, today) === 1 ? current.streak + 1 : 1) : current.streak;
      const nextState = { ...current, completedTasks: nextCompletedTasks, completedDate: today, lastCompletionDate: !taskAlreadyCompleted && current.lastCompletionDate !== today ? today : current.lastCompletionDate, streak: nextStreak, bestStreak: Math.max(current.bestStreak, nextStreak), lifetimeXp: shouldAwardXp ? current.lifetimeXp + completedTask.xp : current.lifetimeXp, awardedXpTasks: shouldAwardXp ? [...current.awardedXpTasks, awardKey] : current.awardedXpTasks, completedTaskTotal: shouldAwardXp ? current.completedTaskTotal + 1 : current.completedTaskTotal, dailyHistory: shouldAwardXp ? { ...current.dailyHistory, [today]: { xp: (current.dailyHistory[today]?.xp || 0) + completedTask.xp, tasks: (current.dailyHistory[today]?.tasks || 0) + 1, coins: (current.dailyHistory[today]?.coins || 0) + completedTask.coins } } : current.dailyHistory };
      const nextUnlockedBadges = getUnlockedBadgeIds(nextState);
      const newBadgeCount = nextUnlockedBadges.filter((badgeId) => !current.unlockedBadges.includes(badgeId)).length;
      const shouldAwardStreakBonus = shouldAwardXp && nextStreak >= 7 && !current.awardedStreakBonuses.includes('7-gun-seri');
      const totalCoinReward = (shouldAwardXp ? completedTask.coins : 0) + (shouldAwardStreakBonus ? 50 : 0) + (shouldAwardXp ? newBadgeCount * 100 : 0);
      if (totalCoinReward > 0) setCoinToast({ amount: totalCoinReward, id: Date.now() });
      return { ...nextState, unlockedBadges: nextUnlockedBadges, coins: current.coins + totalCoinReward, awardedStreakBonuses: shouldAwardStreakBonus ? [...current.awardedStreakBonuses, '7-gun-seri'] : current.awardedStreakBonuses };
    });
  };

  const resetGoalForm = () => setGoalForm({ title: '', description: '', category: 'fitness', type: 'gunluk', targetValue: 5, currentProgress: 0, startDate: todayKey(), endDate: todayKey() });
  const saveGoal = (event) => {
    event.preventDefault();
    const normalizedGoal = { ...goalForm, title: goalForm.title.trim(), description: goalForm.description.trim(), targetValue: Math.max(Number(goalForm.targetValue), 1), currentProgress: Math.max(Number(goalForm.currentProgress), 0) };
    if (!normalizedGoal.title) return;
    setCoachState((current) => ({ ...current, goals: [...current.goals, { id: createGoalId(), ...normalizedGoal, completed: false, rewarded: false, createdAt: today }] }));
    resetGoalForm();
  };
  const completeGoal = (goal) => {
    if (goal.rewarded) return;
    const reward = getGoalType(goal.type);
    setCoinToast({ amount: reward.coins, id: Date.now() });
    setCoachState((current) => {
      const nextState = { ...current, lifetimeXp: current.lifetimeXp + reward.xp, coins: current.coins + reward.coins, dailyHistory: { ...current.dailyHistory, [today]: { xp: (current.dailyHistory[today]?.xp || 0) + reward.xp, tasks: current.dailyHistory[today]?.tasks || 0, coins: (current.dailyHistory[today]?.coins || 0) + reward.coins } }, goals: current.goals.map((item) => item.id === goal.id ? { ...item, currentProgress: item.targetValue, completed: true, rewarded: true, completedAt: today } : item) };
      return { ...nextState, unlockedBadges: getUnlockedBadgeIds(nextState) };
    });
  };
  const updateGoalProgress = (goalId, nextProgress) => {
    setCoachState((current) => {
      let rewardToApply = null;
      const goals = current.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        const currentProgress = Math.min(Math.max(Number(nextProgress), 0), goal.targetValue);
        const completed = currentProgress >= goal.targetValue;
        if (completed && !goal.rewarded) rewardToApply = getGoalType(goal.type);
        return { ...goal, currentProgress, completed, rewarded: completed ? true : goal.rewarded, completedAt: completed ? today : goal.completedAt };
      });
      if (!rewardToApply) return { ...current, goals };
      setCoinToast({ amount: rewardToApply.coins, id: Date.now() });
      const nextState = {
        ...current,
        goals,
        lifetimeXp: current.lifetimeXp + rewardToApply.xp,
        coins: current.coins + rewardToApply.coins,
        dailyHistory: {
          ...current.dailyHistory,
          [today]: {
            xp: (current.dailyHistory[today]?.xp || 0) + rewardToApply.xp,
            tasks: current.dailyHistory[today]?.tasks || 0,
            coins: (current.dailyHistory[today]?.coins || 0) + rewardToApply.coins,
          },
        },
      };
      return { ...nextState, unlockedBadges: getUnlockedBadgeIds(nextState) };
    });
  };

  const completeFocusSession = () => {
    const reward = focusReward(selectedFocusMinutes);
    const session = { id: `odak-${Date.now()}`, date: today, minutes: selectedFocusMinutes, xp: reward.xp, coins: reward.coins };
    playFocusSound(); setIsFocusRunning(false); setRemainingFocusSeconds(selectedFocusMinutes * 60); setFocusCelebration({ ...reward, minutes: selectedFocusMinutes, id: Date.now() }); setCoinToast({ amount: reward.coins, id: Date.now() });
    setCoachState((current) => {
      const nextState = { ...current, lifetimeXp: current.lifetimeXp + reward.xp, coins: current.coins + reward.coins, focusSessions: [session, ...current.focusSessions], focusMinutesTotal: current.focusMinutesTotal + selectedFocusMinutes, dailyFocusHistory: { ...current.dailyFocusHistory, [today]: { minutes: (current.dailyFocusHistory[today]?.minutes || 0) + selectedFocusMinutes, sessions: (current.dailyFocusHistory[today]?.sessions || 0) + 1 } }, dailyHistory: { ...current.dailyHistory, [today]: { xp: (current.dailyHistory[today]?.xp || 0) + reward.xp, tasks: current.dailyHistory[today]?.tasks || 0, coins: (current.dailyHistory[today]?.coins || 0) + reward.coins } } };
      return { ...nextState, unlockedBadges: getUnlockedBadgeIds(nextState) };
    });
  };
  const resetFocusTimer = () => { setIsFocusRunning(false); setRemainingFocusSeconds(selectedFocusMinutes * 60); };

  return { coachState, setCoachState, coinToast, focusCelebration, activeCategory, setActiveCategory, editingTaskId, taskForm, setTaskForm, goalForm, setGoalForm, selectedFocusMinutes, setSelectedFocusMinutes, remainingFocusSeconds, isFocusRunning, setIsFocusRunning, xpChartRef, taskChartRef, focusChartRef, totalXp, level, xpInLevel, progress, completedCount: completedTasks.length, streakProgress: Math.min((coachState.streak / 7) * 100, 100), unlockedBadgeCount, filteredTasks, selectedCategoryName, activeGoals, completedGoals, goalSuccessRate, weeklyStats, updateUserName, saveTask, editTask, deleteTask, toggleTask, resetTaskForm, saveGoal, completeGoal, updateGoalProgress, resetFocusTimer };
};
