/**
 * Mock purchases service — DEMO_MODE = true.
 *
 * Entitlement is stored in AsyncStorage so it survives app restarts.
 * The settings screen demo-mode toggle calls setMockEntitlement() directly,
 * letting the handed-over simulator build show paywall → unlock without a
 * real App Store account or StoreKit Configuration File.
 */
import { useAuthStore } from '@/features/auth/store';
import { getItem, setItem } from '@/shared/storage';
import type { Entitlement, Offering, PurchaseResult, PurchasesService } from './types';

function entitlementKey(): string {
  const email = useAuthStore.getState().email;
  return `@momentum/entitlement/${email ?? 'anonymous'}`;
}

const MOCK_OFFERINGS: Offering[] = [
  {
    productId: 'momentum_pro_monthly',
    title: 'Momentum Pro — Monthly',
    description: 'Unlimited habits, statistics, and a custom theme.',
    price: '$4.99 / month',
  },
  {
    productId: 'momentum_pro_annual',
    title: 'Momentum Pro — Annual',
    description: 'Everything in Pro, billed yearly. Save 40%.',
    price: '$34.99 / year',
    strikethroughPrice: '$59.99 / year',
    badge: 'BEST VALUE',
  },
];

/** Exposed so the settings demo-mode toggle can reset to free. */
export async function setMockEntitlement(value: Entitlement): Promise<void> {
  await setItem(entitlementKey(), value);
}

export const mockPurchasesService: PurchasesService = {
  async getEntitlement(): Promise<Entitlement> {
    const stored = await getItem(entitlementKey());
    return stored === 'Pro' ? 'Pro' : 'Free';
  },

  async getOfferings(): Promise<Offering[]> {
    return MOCK_OFFERINGS;
  },

  async purchase(_productId: string): Promise<PurchaseResult> {
    await setItem(entitlementKey(), 'Pro');
    return { status: 'purchased' };
  },

  async restore(): Promise<void> {
    // In demo mode restore is a no-op — getEntitlement() already reads
    // the persisted value from AsyncStorage.
  },
};
