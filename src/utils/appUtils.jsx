const todayKey = window.todayKey = (date = new Date()) => date.toLocaleDateString('en-CA');
const getLastSevenDays = window.getLastSevenDays = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index));
  return todayKey(date);
});
const dayDifference = window.dayDifference = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;
  return Math.round((new Date(`${toDate}T00:00:00`) - new Date(`${fromDate}T00:00:00`)) / (24 * 60 * 60 * 1000));
};
const createTaskId = window.createTaskId = () => `gorev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const createGoalId = window.createGoalId = () => `hedef-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const getCategory = window.getCategory = (categoryId) => taskCategories.find((category) => category.id === categoryId) || taskCategories[0];
const getGoalType = window.getGoalType = (goalTypeId) => goalTypes.find((goalType) => goalType.id === goalTypeId) || goalTypes[0];
const formatFocusTime = window.formatFocusTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
const getUnlockedBadgeIds = window.getUnlockedBadgeIds = (state) => {
  const unlocked = new Set(state.unlockedBadges || []);
  if ((state.completedTasks || []).length > 0 || state.lastCompletionDate) unlocked.add('baslangic');
  if ((state.streak || 0) >= 7) unlocked.add('istikrarli');
  if ((state.lifetimeXp || 0) >= 100) unlocked.add('caliskan');
  if ((state.lifetimeXp || 0) >= 500) unlocked.add('usta');
  if ((state.streak || 0) >= 30) unlocked.add('efsane');
  return [...unlocked];
};
const playFocusSound = window.playFocusSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(980, audioContext.currentTime + 0.16);
  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.55);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.6);
};
