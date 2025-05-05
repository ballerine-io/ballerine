import { useQuery } from '@tanstack/react-query';

import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { IDocumentVerificationChecksParams } from '@/domains/document-verification/fetchers';
import { documentVerificationChecksQueryKey } from '@/domains/document-verification/query-keys';

export const useDocumentVerificationChecksQuery = (params: IDocumentVerificationChecksParams) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...documentVerificationChecksQueryKey.list(params),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
