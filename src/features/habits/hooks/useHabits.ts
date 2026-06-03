import { useQuery } from '@tanstack/react-query';
import { getHabits, getHabit } from '@/shared/api';

export const HABITS_KEY = ['habits'] as const;

export function useHabits() {
  return useQuery({
    queryKey: HABITS_KEY,
    queryFn: getHabits,
  });
}

export function useHabit(id: string | null) {
  return useQuery({
    queryKey: ['habits', id] as const,
    queryFn: () => getHabit(id!),
    enabled: id != null,
  });
}
