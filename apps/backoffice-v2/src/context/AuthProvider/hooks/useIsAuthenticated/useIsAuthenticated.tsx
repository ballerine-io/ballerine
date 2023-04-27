import { useGetSessionQuery } from '../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';

export const useIsAuthenticated = () => !!useGetSessionQuery()?.data?.user;
