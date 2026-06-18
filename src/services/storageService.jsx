const STORAGE_KEY = window.STORAGE_KEY = 'dijital-yasam-kocu-state';
const getEmptyState = window.getEmptyState = () => ({
  userName: '', completedTasks: [], completedDate: todayKey(), streak: 0, bestStreak: 0, lastCompletionDate: '',
  lifetimeXp: 0, awardedXpTasks: [], unlockedBadges: [], coins: 0, awardedStreakBonuses: [], completedTaskTotal: 0,
  dailyHistory: {}, tasks: defaultTasks, focusSessions: [], focusMinutesTotal: 0, dailyFocusHistory: {}, goals: [],
});
const normalizeStoredState = window.normalizeStoredState = () => {
  const emptyState = getEmptyState();
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (!savedState) return emptyState;
  const today = todayKey();
  const missedDays = dayDifference(savedState.lastCompletionDate, today);
  const isNewDay = savedState.completedDate !== today;
  const normalizedState = {
    ...emptyState, ...savedState,
    completedTasks: isNewDay ? [] : savedState.completedTasks || [],
    completedDate: today,
    streak: missedDays > 1 ? 0 : savedState.streak || 0,
    bestStreak: savedState.bestStreak || 0,
    lifetimeXp: savedState.lifetimeXp || 0,
    awardedXpTasks: savedState.awardedXpTasks || [],
    unlockedBadges: savedState.unlockedBadges || [],
    coins: savedState.coins || 0,
    awardedStreakBonuses: savedState.awardedStreakBonuses || [],
    completedTaskTotal: savedState.completedTaskTotal || 0,
    dailyHistory: savedState.dailyHistory || {},
    tasks: savedState.tasks?.length ? savedState.tasks : defaultTasks,
    focusSessions: savedState.focusSessions || [],
    focusMinutesTotal: savedState.focusMinutesTotal || 0,
    dailyFocusHistory: savedState.dailyFocusHistory || {},
    goals: savedState.goals || [],
  };
  return { ...normalizedState, unlockedBadges: getUnlockedBadgeIds(normalizedState) };
};
const saveState = window.saveState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
