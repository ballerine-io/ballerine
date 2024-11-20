import { TAuthenticatedUser } from '@/domains/auth/types';

export type TUserRole = 'viewer';

export const filterUsersByRole = (
  users: Array<Partial<TAuthenticatedUser>>,
  excludedRoles: TUserRole[],
) => {
  return users.filter(user => {
    if (!user) return false;

    if (!('roles' in user)) return true;

    return !excludedRoles.some(role => Array.isArray(user.roles) && user.roles.includes(role));
  });
};
