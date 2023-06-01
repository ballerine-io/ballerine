import { useQuery } from '@tanstack/react-query';
import { authQueryKeys } from '../../../query-keys';

export const useAuthenticatedUserQuery = () => {
  return useQuery(authQueryKeys.authenticatedUser());
};
