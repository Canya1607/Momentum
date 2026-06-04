/**
 * DEMO_MODE = true  → mock purchases service (entitlement flips locally).
 *                     Use this for the handed-over simulator build so the
 *                     reviewer can see paywall → unlock without a real App Store account.
 *
 * DEMO_MODE = false → real StoreKit flow via storekitPurchasesService.
 *                     Requires `npx expo run:ios` with a StoreKit Configuration
 *                     File; Expo Go cannot load native IAP modules.
 */
export const DEMO_MODE = true;

export const FREE_HABIT_LIMIT = 3;
