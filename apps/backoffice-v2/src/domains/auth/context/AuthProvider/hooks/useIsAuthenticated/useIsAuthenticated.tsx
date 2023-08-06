import { useAuthenticatedUserQuery } from '../../../../hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const useIsAuthenticated = () => !!useAuthenticatedUserQuery()?.data?.user;
// export const useIsAuthenticated = () => true;
