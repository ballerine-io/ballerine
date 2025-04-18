import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useMemo } from 'react';

export const useIsAssignedToMe = ({ assigneeId }: { assigneeId: string }) => {
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user || null;

  const isAssignedToMe = useMemo(() => {
    if (!authenticatedUser || !assigneeId) {
      return false;
    }

    return assigneeId === authenticatedUser.id;
  }, [authenticatedUser, assigneeId]);

  return isAssignedToMe;
};
