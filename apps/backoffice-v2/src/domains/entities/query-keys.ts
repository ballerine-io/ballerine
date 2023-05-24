import { individualsQueryKeys } from '../individuals/query-keys';
import { businessesQueryKeys } from '../businesses/query-keys';

export const queryKeys = {
  individuals: individualsQueryKeys,
  businesses: businessesQueryKeys,
} as const;
