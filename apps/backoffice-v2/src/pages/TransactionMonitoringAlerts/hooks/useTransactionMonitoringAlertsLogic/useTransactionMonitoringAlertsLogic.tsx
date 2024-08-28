import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { getAlertsSearchSchema } from '@/pages/TransactionMonitoringAlerts/get-alerts-search-schema';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAlertsQuery } from '@/domains/alerts/hooks/queries/useAlertsQuery/useAlertsQuery';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useMemo } from 'react';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { useSearch } from '@/common/hooks/useSearch/useSearch';
import { useAlertCorrelationIdsQuery } from '@/domains/alerts/hooks/queries/useAlertLabelsQuery/useAlertLabelsQuery';

export const useTransactionMonitoringAlertsLogic = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const AlertsSearchSchema = getAlertsSearchSchema(session?.user?.id);
  const [{ filter, sortBy, sortDir, page, pageSize, search: searchValue }] =
    useZodSearchParams(AlertsSearchSchema);
  const { data: alerts, isLoading: isLoadingAlerts } = useAlertsQuery({
    filter,
    page,
    pageSize,
    search: searchValue,
    sortDir,
    sortBy,
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
  const { data: correlationIds } = useAlertCorrelationIdsQuery();
  const sortedCorrelationIds = useMemo(() => correlationIds?.slice()?.sort(), [correlationIds]);
  const { onPaginate, onPrevPage, onNextPage, onLastPage } = usePagination({
    totalPages: 0,
  });
  const isLastPage = (alerts?.length ?? 0) < pageSize || alerts?.length === 0;
  const { search, onSearch } = useSearch({
    initialSearch: searchValue,
  });

  return {
    alerts,
    isLoadingAlerts,
    assignees: sortedAssignees,
    correlationIds: sortedCorrelationIds,
    authenticatedUser: session?.user,
    page,
    pageSize,
    onPrevPage,
    onNextPage,
    onLastPage,
    onPaginate,
    isLastPage,
    search,
    onSearch,
  };
};
