import { collectionFlowQuerykeys } from '@/domains/collection-flow';
import {
  clearPostHogUser,
  clearSentryUser,
  updatePostHogUser,
  updateSentryUser,
} from '@/initialize-monitoring/initialize-monitoring';
import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useEffect } from 'react';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

export const useEndUserQuery = () => {
  const workflowId = useWorkflowId();

  const {
    data: endUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...collectionFlowQuerykeys.getEndUser(),
    // @ts-ignore
    enabled: !!workflowId,
    // @ts-ignore
    staleTime: Infinity as const,
  });

  useEffect(() => {
    if (endUser) {
      updateSentryUser({
        id: endUser.id,
        email: endUser.email,
        fullName: `${endUser.firstName} ${endUser.lastName}`,
      });

      updatePostHogUser({
        id: endUser.id,
        email: endUser.email,
        fullName: `${endUser.firstName} ${endUser.lastName}`,
      });
    } else {
      clearSentryUser();
      clearPostHogUser();
    }

    return () => {
      clearSentryUser();
      clearPostHogUser();
    };
  }, [endUser]);

  return {
    data: endUser,
    isLoading,
    error: error ? (error as HTTPError) : null,
    refetch,
  };
};
