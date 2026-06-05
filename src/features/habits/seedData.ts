/**
 * Demo seed data for development / CTO review.
 * Replaces all habits with a realistic dataset so stats, charts, and
 * streaks are visible without manually tracking habits over real days.
 *
 * demo boundary: this file is only called from the DEMO_MODE Developer
 * section in settings and is never imported in production code paths.
 */
import { setJsonItem } from '@/shared/storage';
import { subtractDays, today } from '@/shared/lib/date';
import type { Habit } from '@/shared/api';
import { useAuthStore } from '@/features/auth/store';

function habitsStorageKey(): string {
  const email = useAuthStore.getState().email;
  return `@momentum/habits/${email ?? 'anonymous'}`;
}

/** Builds a completions array: `streakDays` consecutive days ending today + extra offsets. */
function completions(streakDays: number, extraOffsets: number[] = []): string[] {
  const todayStr = today();
  const set = new Set<string>();
  for (let i = 0; i < streakDays; i++) set.add(subtractDays(todayStr, i));
  for (const offset of extraOffsets) set.add(subtractDays(todayStr, offset));
  return Array.from(set);
}

function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 864e5).toISOString();
}

function buildFreeHabits(): Habit[] {
  return [
    {
      id: 'seed-workout',
      name: 'Workout',
      emoji: 'barbell-outline',
      createdAt: daysAgoIso(30),
      // 7-day streak; visible every day in the weekly chart
      completions: completions(7, [9, 11, 14, 16, 20]),
    },
    {
      id: 'seed-read',
      name: 'Read',
      emoji: 'book-outline',
      createdAt: daysAgoIso(20),
      // 3-day streak + scattered history
      completions: completions(3, [5, 8, 10, 13]),
    },
    {
      id: 'seed-water',
      name: 'Drink water',
      emoji: 'water-outline',
      createdAt: daysAgoIso(15),
      // 0-day streak — missed today; some history shows in chart
      completions: completions(0, [4, 6, 8, 11, 13]),
    },
  ];
}

function buildProHabits(): Habit[] {
  return [
    {
      id: 'seed-workout',
      name: 'Workout',
      emoji: 'barbell-outline',
      createdAt: daysAgoIso(90),
      // 62-day streak — > 2 months
      completions: completions(62, [64, 66, 70, 75, 80]),
    },
    {
      id: 'seed-run',
      name: 'Morning run',
      emoji: 'walk-outline',
      createdAt: daysAgoIso(60),
      // 30-day streak — ~1 month
      completions: completions(30, [32, 35, 38, 42, 47]),
    },
    {
      id: 'seed-read',
      name: 'Read',
      emoji: 'book-outline',
      createdAt: daysAgoIso(45),
      // 14-day streak — 2 weeks
      completions: completions(14, [16, 18, 21, 25, 30]),
    },
    {
      id: 'seed-meditate',
      name: 'Meditate',
      emoji: 'leaf-outline',
      createdAt: daysAgoIso(30),
      // 7-day streak — 1 week
      completions: completions(7, [9, 12, 15, 19, 22]),
    },
    {
      id: 'seed-water',
      name: 'Drink water',
      emoji: 'water-outline',
      createdAt: daysAgoIso(20),
      // 3-day streak
      completions: completions(3, [5, 7, 9, 12]),
    },
    {
      id: 'seed-journal',
      name: 'Journal',
      emoji: 'create-outline',
      createdAt: daysAgoIso(10),
      // 1-day streak — just started today
      completions: completions(1, [3, 5, 8]),
    },
    {
      id: 'seed-sleep',
      name: 'Sleep 8 hrs',
      emoji: 'moon-outline',
      createdAt: daysAgoIso(25),
      // 0-day streak — broke the chain; history visible in chart
      completions: completions(0, [4, 6, 9, 12, 15, 18, 21]),
    },
  ];
}

export async function seedDemoHabits(plan: 'Free' | 'Pro'): Promise<void> {
  const habits = plan === 'Pro' ? buildProHabits() : buildFreeHabits();
  await setJsonItem(habitsStorageKey(), habits);
}
