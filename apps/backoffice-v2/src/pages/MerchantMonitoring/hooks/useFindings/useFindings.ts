import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { findingsQueryKey } from '@/pages/MerchantMonitoring/query-keys';
import { FindingsSchema } from '@/pages/MerchantMonitoring/schemas';

export const useFindings = () => {
  const isAuthenticated = useIsAuthenticated();

  const { data, isLoading } = useQuery({
    ...findingsQueryKey.list(),
    enabled: isAuthenticated,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });

  if (data) {
    localStorage.setItem('findings', JSON.stringify(data));
  }

  let findings: Array<{ value: string; label: string }> = [];
  const findingsString = localStorage.getItem('findings');

  try {
    const findingsObject = findingsString ? JSON.parse(findingsString) : [];

    const parsedFindings = FindingsSchema.safeParse(findingsObject);

    if (parsedFindings.success) {
      findings = parsedFindings.data;
    }
  } catch (error) {
    findings = [];
  }

  return {
    findings,
    isLoading,
  };
};
