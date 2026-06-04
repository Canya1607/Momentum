import { DEMO_MODE } from '@/config';
import { mockPurchasesService } from './mock';
import { storekitPurchasesService } from './storekit';

/**
 * The single purchase service instance consumed by all UI code.
 * Swap the implementation by toggling DEMO_MODE in src/config/index.ts.
 */
export const purchasesService = DEMO_MODE
  ? mockPurchasesService
  : storekitPurchasesService;

export { setMockEntitlement } from './mock';
export type { PurchasesService, Entitlement, Offering, PurchaseResult } from './types';
