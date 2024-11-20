import { TAuthenticatedUser } from '@/domains/auth/types';

export type TUserRole = 'viewer';

export const filterUsersByRole = (
  users: Array<Partial<TAuthenticatedUser>>,
  excludedRoles: TUserRole[],
) => {
  return users.filter(user => {
    if (!user) return false;

    // If user has no roles, include them
    if (!('roles' in user)) return true;

    // Exclude user if they have any of the excluded roles
    return !excludedRoles.some(role => Array.isArray(user.roles) && user.roles.includes(role));
  });
};
