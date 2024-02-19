import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { alertsQueryKeys } from '@/domains/alerts/query-keys';

export const useAlertDefinitionByAlertIdQuery = ({ alertId }: { alertId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...alertsQueryKeys.alertDefinitionByAlertId({ alertId }),
    enabled: isAuthenticated && !!alertId,
    staleTime: 100_000,
  });
};
