import { usersKeys } from '@/domains/workflows/api/users';
import { useQuery } from '@tanstack/react-query';

export const useActiveUsersQuery = () => {
  // @ts-ignore
  const { data = [], isLoading } = useQuery({
    ...usersKeys.activeUsers({}),
  });

  return {
    data,
    isLoading,
  };
};
