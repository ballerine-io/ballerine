import { endUsers } from './end-users';
import { businesses } from './businesses';

export const queries = {
  individuals: endUsers,
  businesses,
} as const;
