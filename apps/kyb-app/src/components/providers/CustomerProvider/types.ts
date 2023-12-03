import { TCustomer } from '@/domains/collection-flow';

export interface CustomerContext {
  customer: TCustomer | null;
}
