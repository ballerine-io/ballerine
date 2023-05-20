import { useAuthenticatedUserQuery } from '../../../../auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';

export const useIsAuthenticated = () => !!useAuthenticatedUserQuery()?.data?.user;
