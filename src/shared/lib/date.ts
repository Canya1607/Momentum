export function toDateString(date: Date): string {
  // Use local date components — toISOString() returns UTC which shifts the
  // date in any timezone with a positive UTC offset, breaking streak checks.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
