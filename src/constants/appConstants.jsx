const taskCategories = window.taskCategories = [
  { id: 'fitness', name: 'Fitness', icon: '💪', color: 'from-orange-100 to-red-100 text-orange-700 shadow-orange-200' },
  { id: 'beslenme', name: 'Beslenme', icon: '🍎', color: 'from-red-100 to-rose-100 text-red-700 shadow-red-200' },
  { id: 'uyku', name: 'Uyku', icon: '😴', color: 'from-indigo-100 to-sky-100 text-indigo-700 shadow-indigo-200' },
  { id: 'ogrenme', name: 'Öğrenme', icon: '📚', color: 'from-sky-100 to-cyan-100 text-sky-700 shadow-sky-200' },
  { id: 'zihin', name: 'Zihin', icon: '🧠', color: 'from-purple-100 to-fuchsia-100 text-purple-700 shadow-purple-200' },
  { id: 'su', name: 'Su', icon: '💧', color: 'from-cyan-100 to-blue-100 text-cyan-700 shadow-cyan-200' },
  { id: 'hareket', name: 'Hareket', icon: '🚶', color: 'from-lime-100 to-emerald-100 text-lime-700 shadow-lime-200' },
];

const difficultyStyles = window.difficultyStyles = {
  Kolay: 'bg-lime-100 text-lime-700',
  Orta: 'bg-yellow-100 text-yellow-700',
  Zor: 'bg-red-100 text-red-700',
};

const defaultTasks = window.defaultTasks = [
  { id: 'varsayilan-fitness', title: 'Sabah 10 dakika esneme yap', description: 'Güne bedenini uyandıran kısa bir rutinle başla.', category: 'fitness', xp: 25, coins: 8, difficulty: 'Kolay' },
  { id: 'varsayilan-zihin', title: 'Bildirimleri 1 saat sessize al', description: 'Odaklanmak için telefon bildirimlerini kısa süreli kapat.', category: 'zihin', xp: 35, coins: 12, difficulty: 'Orta' },
  { id: 'varsayilan-ogrenme', title: '15 dakika kitap oku', description: 'Dijital molanı öğrenme alışkanlığına dönüştür.', category: 'ogrenme', xp: 30, coins: 10, difficulty: 'Orta' },
  { id: 'varsayilan-su', title: 'Bir bardak su iç ve nefes molası ver', description: 'Su iç, derin nefes al ve enerjini yenile.', category: 'su', xp: 20, coins: 6, difficulty: 'Kolay' },
  { id: 'varsayilan-hareket', title: 'Günün ekran süresinden sonra yürüyüş yap', description: 'Ekran molasını kısa bir hareket arasına çevir.', category: 'hareket', xp: 40, coins: 15, difficulty: 'Zor' },
];

const focusDurations = window.focusDurations = [15, 25, 45, 60];
const focusReward = window.focusReward = (minutes) => ({ xp: minutes * 2, coins: Math.round(minutes * 1.5) });
const goalTypes = window.goalTypes = [
  { id: 'gunluk', name: 'Günlük hedef', xp: 40, coins: 20, color: 'from-lime-100 to-emerald-100 text-lime-700 shadow-lime-200' },
  { id: 'haftalik', name: 'Haftalık hedef', xp: 90, coins: 45, color: 'from-sky-100 to-cyan-100 text-sky-700 shadow-sky-200' },
  { id: 'aylik', name: 'Aylık hedef', xp: 180, coins: 90, color: 'from-purple-100 to-fuchsia-100 text-purple-700 shadow-purple-200' },
];
const badgeDefinitions = window.badgeDefinitions = [
  { id: 'baslangic', title: 'Başlangıç Rozeti', description: 'İlk görevini tamamlayarak yolculuğa başladın.', icon: '🚀', color: 'from-sky-100 to-cyan-100 text-sky-700 shadow-sky-200' },
  { id: 'istikrarli', title: 'İstikrarlı', description: '7 günlük seri yaparak alışkanlığını güçlendirdin.', icon: '🔥', color: 'from-orange-100 to-red-100 text-orange-700 shadow-orange-200' },
  { id: 'caliskan', title: 'Çalışkan', description: 'Toplam 100 XP kazanarak emeğini gösterdin.', icon: '💪', color: 'from-lime-100 to-emerald-100 text-emerald-700 shadow-lime-200' },
  { id: 'usta', title: 'Usta', description: 'Toplam 500 XP kazanarak ustalığa yaklaştın.', icon: '🏆', color: 'from-yellow-100 to-amber-100 text-amber-700 shadow-yellow-200' },
  { id: 'efsane', title: 'Efsane', description: '30 günlük seriyle dijital dengenin efsanesi oldun.', icon: '👑', color: 'from-fuchsia-100 to-purple-100 text-purple-700 shadow-fuchsia-200' },
];
