import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAlertLabelsQuery } from '@/domains/alerts/hooks/queries/useAlertLabelsQuery/useAlertLabelsQuery';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useBusinessAlertsQuery } from '@/domains/business-alerts/hooks/queries/useBusinessAlertsQuery/useBusinessAlertsQuery';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { getAlertsSearchSchema } from '@/pages/TransactionMonitoringAlerts/get-alerts-search-schema';
import { useMemo } from 'react';

export const useTransactionMonitoringAlertsLogic = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const AlertsSearchSchema = getAlertsSearchSchema(session?.user?.id);
  const [{ filter, sortBy, sortDir, page, pageSize, search: searchValue }] =
    useZodSearchParams(AlertsSearchSchema);
  const { data: alerts = [], isLoading: isLoadingAlerts } = useBusinessAlertsQuery({
    filter,
    page,
    pageSize,
    search: searchValue,
    sortDir,
    sortBy,
    entityType: 'business',
  });
  const { data: assignees } = useUsersQuery();
  const sortedAssignees = useMemo(
    () =>
      // Sort assignees so that the authenticated user is always first
      assignees
        ?.slice()
        ?.sort((a, b) => (a?.id === session?.user?.id ? -1 : b?.id === session?.user?.id ? 1 : 0)),
    [assignees, session?.user?.id],
  );
  const { data: labels } = useAlertLabelsQuery();
  const sortedLabels = useMemo(() => labels?.slice()?.sort(), [labels]);
  const { onPaginate, onPrevPage, onNextPage } = usePagination();
  const isLastPage = (alerts?.length ?? 0) < pageSize || alerts?.length === 0;
  const { search, onSearch } = useSearch({
    initialSearch: searchValue,
  });

  return {
    alerts,
    isLoadingAlerts,
    assignees: sortedAssignees,
    labels: sortedLabels,
    authenticatedUser: session?.user,
    page,
    pageSize,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
    search,
    onSearch,
  };
};
