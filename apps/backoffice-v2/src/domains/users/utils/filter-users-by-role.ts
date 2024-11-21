import { TAuthenticatedUser } from '@/domains/auth/types';

export type TUserRole = 'viewer';

export const filterUsersByRole = (
  users: Array<Partial<TAuthenticatedUser>>,
  excludedRoles: TUserRole[],
) => {
  if (!Array.isArray(users)) return [];

  return users.filter(user => {
    if (!user) return false;

    if (!('roles' in user) || !Array.isArray(user.roles)) {
      return true;
    }

    return !excludedRoles.some(role => user.roles.includes(role));
  });
};
