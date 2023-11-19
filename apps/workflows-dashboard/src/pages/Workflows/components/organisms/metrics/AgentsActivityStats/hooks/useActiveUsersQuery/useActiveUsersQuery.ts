import { usersKeys } from '@/domains/workflows/api/users';
import { useQuery } from '@tanstack/react-query';

export const useActiveUsersQuery = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data = [], isLoading } = useQuery({
    ...usersKeys.activeUsers({}),
  });

  return {
    data,
    isLoading,
  };
};
