import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchasesService } from '@/services/purchases';

export const ENTITLEMENT_KEY = ['entitlement'] as const;
const OFFERINGS_KEY = ['offerings'] as const;

export function useEntitlement() {
  return useQuery({
    queryKey: ENTITLEMENT_KEY,
    queryFn: () => purchasesService.getEntitlement(),
    staleTime: 0, // always re-check; entitlement can change from settings
  });
}

export function useOfferings() {
  return useQuery({
    queryKey: OFFERINGS_KEY,
    queryFn: () => purchasesService.getOfferings(),
  });
}

export function usePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => purchasesService.purchase(productId),
    onSuccess: result => {
      if (result.status === 'purchased') {
        queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
      }
    },
  });
}

export function useRestorePurchases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => purchasesService.restore(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTITLEMENT_KEY });
    },
  });
}
