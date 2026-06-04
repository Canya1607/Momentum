export type Entitlement = 'free' | 'pro';

export interface Offering {
  productId: string;
  title: string;
  description: string;
  price: string; // formatted display string, e.g. "$4.99/month"
}

export type PurchaseResult =
  | { status: 'purchased' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

/**
 * All purchase and entitlement logic flows through this interface.
 * Paywall and gating code never import from mock.ts or storekit.ts directly —
 * they only talk to this contract, making the real/demo swap invisible to the UI.
 */
export interface PurchasesService {
  getEntitlement(): Promise<Entitlement>;
  getOfferings(): Promise<Offering[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<void>;
}
