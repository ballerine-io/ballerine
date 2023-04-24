import { endUsers } from './end-users';
import { companies } from './companies';

export const queries = {
  individuals: endUsers,
  companies,
} as const;
