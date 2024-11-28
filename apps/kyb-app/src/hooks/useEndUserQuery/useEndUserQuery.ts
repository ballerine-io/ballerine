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

export const useEndUserQuery = () => {
  const {
    data: endUser,
    isLoading,
    error,
    refetch,
    isFetched,
  } = useQuery({
    ...collectionFlowQuerykeys.getEndUser(),
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
    isLoading: isLoading && !isFetched,
    error: error ? (error as HTTPError) : null,
    refetch,
    isLoaded: isFetched,
  };
};
