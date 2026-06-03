export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function today(): string {
  return toDateString(new Date());
}

export function subtractDays(dateStr: string, days: number): string {
  // Parse as local midnight to avoid UTC-shift issues
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() - days);
  return toDateString(d);
}

/** Current consecutive-day streak ending today (0 if today not completed). */
export function computeStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const set = new Set(completions);
  let cursor = today();
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = subtractDays(cursor, 1);
  }
  return streak;
}
