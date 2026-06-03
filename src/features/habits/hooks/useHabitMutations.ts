import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion,
  type CreateHabitInput,
  type UpdateHabitInput,
} from '@/shared/api';
import { HABITS_KEY } from './useHabits';

function useInvalidateHabits() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: HABITS_KEY });
}

export function useCreateHabit() {
  const invalidate = useInvalidateHabits();
  return useMutation({
    mutationFn: (input: CreateHabitInput) => createHabit(input),
    onSuccess: invalidate,
  });
}

export function useUpdateHabit() {
  const invalidate = useInvalidateHabits();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHabitInput }) =>
      updateHabit(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteHabit() {
  const invalidate = useInvalidateHabits();
  return useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: invalidate,
  });
}

export function useToggleCompletion() {
  const invalidate = useInvalidateHabits();
  return useMutation({
    mutationFn: (id: string) => toggleCompletion(id),
    onSuccess: invalidate,
  });
}
