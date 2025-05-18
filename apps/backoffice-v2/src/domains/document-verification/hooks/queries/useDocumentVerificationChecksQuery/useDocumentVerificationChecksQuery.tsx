import { useQuery } from '@tanstack/react-query';

import { fetchDocumentVerificationChecks } from '@/domains/document-verification/fetchers';

const DOCUMENT_VERIFICATION_CHECKS_QUERY_KEY = 'documentVerificationChecks';

export const useDocumentVerificationChecksQuery = (params: {
  page: {
    number: number;
    size: number;
  };
  status?: string[];
  from?: Date;
  to?: Date;
}) => {
  return useQuery({
    queryKey: [DOCUMENT_VERIFICATION_CHECKS_QUERY_KEY, params],
    queryFn: () =>
      fetchDocumentVerificationChecks({
        page: params.page.number,
        limit: params.page.size,
        status: params.status,
        from: params.from?.toISOString(),
        to: params.to?.toISOString(),
      }),
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1, // Only retry once
    refetchOnMount: true,
    refetchInterval: false, // Don't automatically refetch at interval
    retryDelay: 1000, // Wait 1 second before retrying
  });
};
