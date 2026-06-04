/**
 * Mock purchases service — DEMO_MODE = true.
 *
 * Entitlement is stored in AsyncStorage so it survives app restarts.
 * The settings screen demo-mode toggle calls setMockEntitlement() directly,
 * letting the handed-over simulator build show paywall → unlock without a
 * real App Store account or StoreKit Configuration File.
 */
import { getItem, setItem } from '@/shared/storage';
import type { Entitlement, Offering, PurchaseResult, PurchasesService } from './types';

const ENTITLEMENT_KEY = '@momentum/entitlement';

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
  },
];

/** Exposed so the settings demo-mode toggle can reset to free. */
export async function setMockEntitlement(value: Entitlement): Promise<void> {
  await setItem(ENTITLEMENT_KEY, value);
}

export const mockPurchasesService: PurchasesService = {
  async getEntitlement(): Promise<Entitlement> {
    const stored = await getItem(ENTITLEMENT_KEY);
    return stored === 'pro' ? 'pro' : 'free';
  },

  async getOfferings(): Promise<Offering[]> {
    return MOCK_OFFERINGS;
  },

  async purchase(_productId: string): Promise<PurchaseResult> {
    await setItem(ENTITLEMENT_KEY, 'pro');
    return { status: 'purchased' };
  },

  async restore(): Promise<void> {
    // In demo mode restore is a no-op — getEntitlement() already reads
    // the persisted value from AsyncStorage.
  },
};
