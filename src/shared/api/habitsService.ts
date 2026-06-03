import { getJsonItem, setJsonItem } from '@/shared/storage';
import { today } from '@/shared/lib/date';

const HABITS_KEY = '@momentum/habits';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string; // ISO timestamp
  completions: string[]; // 'YYYY-MM-DD' strings
}

export type CreateHabitInput = Pick<Habit, 'name' | 'emoji'>;
export type UpdateHabitInput = Partial<Pick<Habit, 'name' | 'emoji'>>;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

async function loadAll(): Promise<Habit[]> {
  return (await getJsonItem<Habit[]>(HABITS_KEY)) ?? [];
}

async function saveAll(habits: Habit[]): Promise<void> {
  await setJsonItem(HABITS_KEY, habits);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getHabits(): Promise<Habit[]> {
  return loadAll();
}

export async function getHabit(id: string): Promise<Habit | null> {
  const habits = await loadAll();
  return habits.find(h => h.id === id) ?? null;
}

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const habits = await loadAll();
  const habit: Habit = {
    id: generateId(),
    name: input.name,
    emoji: input.emoji,
    createdAt: new Date().toISOString(),
    completions: [],
  };
  await saveAll([...habits, habit]);
  return habit;
}

export async function updateHabit(id: string, input: UpdateHabitInput): Promise<Habit> {
  const habits = await loadAll();
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) throw new Error(`Habit ${id} not found`);
  const updated: Habit = { ...habits[index] as Habit, ...input };
  const next = [...habits];
  next[index] = updated;
  await saveAll(next);
  return updated;
}

export async function deleteHabit(id: string): Promise<void> {
  const habits = await loadAll();
  await saveAll(habits.filter(h => h.id !== id));
}

/**
 * Toggles today's completion for a habit.
 * Adds today if not present, removes it if already completed.
 */
export async function toggleCompletion(id: string): Promise<Habit> {
  const habits = await loadAll();
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) throw new Error(`Habit ${id} not found`);

  const habit = habits[index] as Habit;
  const dateStr = today();
  const alreadyDone = habit.completions.includes(dateStr);
  const completions = alreadyDone
    ? habit.completions.filter(d => d !== dateStr)
    : [...habit.completions, dateStr];

  const updated: Habit = { ...habit, completions };
  const next = [...habits];
  next[index] = updated;
  await saveAll(next);
  return updated;
}
