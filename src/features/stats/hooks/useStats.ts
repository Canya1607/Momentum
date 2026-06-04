import { useHabits } from '@/features/habits';
import { computeStreak, subtractDays, today } from '@/shared/lib/date';

export interface DayData {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

export interface HabitStat {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedToday: boolean;
}

export function useStats() {
  const { data: habits = [] } = useHabits();

  const todayStr = today();

  const completedToday = habits.filter(h => h.completions.includes(todayStr)).length;
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => computeStreak(h.completions))) : 0;

  // Last 7 days: how many habits were completed each day
  const last7Days: DayData[] = Array.from({ length: 7 }, (_, i) => {
    const date = subtractDays(todayStr, 6 - i);
    return { date, count: habits.filter(h => h.completions.includes(date)).length };
  });

  const habitsByStreak: HabitStat[] = habits
    .map(h => ({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      streak: computeStreak(h.completions),
      completedToday: h.completions.includes(todayStr),
    }))
    .sort((a, b) => b.streak - a.streak);

  return { completedToday, totalHabits, totalCompletions, bestStreak, last7Days, habitsByStreak };
}
