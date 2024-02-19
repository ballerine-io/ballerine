import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { alertDefinitionsQueryKeys } from '@/domains/alert-definitions/query-keys';

export const useAlertDefinitionByAlertIdQuery = ({ alertId }: { alertId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...alertDefinitionsQueryKeys.byAlertId({ alertId }),
    enabled: isAuthenticated && !!alertId,
    staleTime: 100_000,
  });
};
