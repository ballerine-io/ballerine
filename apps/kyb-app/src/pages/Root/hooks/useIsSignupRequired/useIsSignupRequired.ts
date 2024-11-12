import { useEndUserQuery } from '@/hooks/useEndUserQuery';

export const useIsSignupRequired = () => {
  const { data: endUser, isLoading } = useEndUserQuery();

  return {
    isLoading,
    isSignupRequired: Boolean(endUser),
  };
};
