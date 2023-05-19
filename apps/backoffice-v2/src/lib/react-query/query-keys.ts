import { businesses } from './businesses';
import { individualsQueryKeys } from '../../individuals/query-keys';

export const queryKeys = {
  individuals: individualsQueryKeys,
  businesses,
} as const;
