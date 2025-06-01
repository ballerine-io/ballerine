import { useEndUserQuery } from '@/hooks/useEndUserQuery';
import { useMemo } from 'react';

export const useIsSignupRequired = () => {
  const { data: endUser, isLoading, error } = useEndUserQuery();

  const isSignupRequired = useMemo(() => {
    if (endUser) {
      return false;
    }

    return error || isLoading;
  }, [error, isLoading, endUser]);

  return {
    isLoading,
    isSignupRequired,
    error,
  };
};
