import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IIdentityVerificationChecksParams } from '@/domains/identity-verification/fetchers';
import { identityVerificationChecksQueryKey } from '@/domains/checks/query-keys';

export const useIdentityVerificationChecksQuery = ({
  ...params
}: IIdentityVerificationChecksParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...identityVerificationChecksQueryKey.list(params),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
