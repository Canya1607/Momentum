/**
 * Real StoreKit purchases service — DEMO_MODE = false.
 *
 * production: implement with RevenueCat (react-native-purchases) or expo-iap.
 *
 * Setup steps:
 *  1. npx expo install react-native-purchases   (RevenueCat) OR
 *     npx expo install expo-iap                 (expo-iap)
 *  2. In Xcode: Product → Scheme → Edit Scheme → Run → Options →
 *     StoreKit Configuration → select your .storekit file.
 *     Uncheck "Sync with App Store Connect" to use it locally.
 *  3. Run via `npx expo run:ios` — Expo Go cannot load native IAP modules.
 *  4. The .storekit file defines product IDs locally; no App Store publishing needed.
 *
 * NOTE: The StoreKit scheme setting is per-machine, not committed to git.
 * The handed-over simulator .app won't auto-use it — use DEMO_MODE = true
 * for the handed-over build and record the real flow via `npx expo run:ios`.
 */
import type { Entitlement, Offering, PurchaseResult, PurchasesService } from './types';

export const storekitPurchasesService: PurchasesService = {
  async getEntitlement(): Promise<Entitlement> {
    // production: const info = await Purchases.getCustomerInfo();
    // return info.entitlements.active['pro'] ? 'pro' : 'free';
    return 'free';
  },

  async getOfferings(): Promise<Offering[]> {
    // production: const offerings = await Purchases.getOfferings();
    // return offerings.current?.availablePackages.map(pkg => ({ ... })) ?? [];
    return [];
  },

  async purchase(_productId: string): Promise<PurchaseResult> {
    // production: const { customerInfo } = await Purchases.purchaseStoreProduct(product);
    // return customerInfo.entitlements.active['pro'] ? { status: 'purchased' } : { status: 'cancelled' };
    return { status: 'error', message: 'StoreKit not configured — set DEMO_MODE = true' };
  },

  async restore(): Promise<void> {
    // production: await Purchases.restorePurchases();
  },
};
