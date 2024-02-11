import { useAlertsQuery } from '@/domains/alerts/hooks/queries/useAlertsQuery/useAlertsQuery';
import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { AlertsHeader } from 'src/pages/TransactionMonitoringAlerts/components/AlertsHeader';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useMemo } from 'react';
import { usePagination } from '@/common/hooks/usePagination/usePagination';
import { getAlertsSearchSchema } from '@/pages/TransactionMonitoringAlerts/get-alerts-search-schema';
import { AlertsPagination } from '@/pages/TransactionMonitoringAlerts/AlertsPagination/AlertsPagination';

export const useTransactionMonitoringAlertsLogic = () => {
  const { data: session } = useAuthenticatedUserQuery();
  const AlertsSearchSchema = getAlertsSearchSchema(session?.user?.id);
  const [{ filter, sortBy, sortDir, page, pageSize, search }, setSearchParams] =
    useZodSearchParams(AlertsSearchSchema);
  const { data: alerts } = useAlertsQuery({
    filter,
    page,
    pageSize,
    search,
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
  const [isSheetOpen, toggleIsAlertAnalysisSheetOpen, toggleOnIsAlertAnalysisSheetOpen] =
    useToggle();
  const { onPaginate, onPrevPage, onNextPage } = usePagination();
  const isLastPage = false;

  return {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
    assignees: sortedAssignees,
    authenticatedUserId: session?.user?.id,
    page,
    pageSize,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
  };
};

export const TransactionMonitoringAlerts = () => {
  const {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
    assignees,
    authenticatedUserId,
    page,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
  } = useTransactionMonitoringAlertsLogic();

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Transaction Monitoring Alerts</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <AlertsHeader assignees={assignees ?? []} authenticatedUserId={authenticatedUserId} />
        <AlertsTable
          data={alerts ?? []}
          toggleOnIsAlertAnalysisSheetOpen={toggleOnIsAlertAnalysisSheetOpen}
        />
        <div className={`flex items-center gap-x-2`}>
          <AlertsPagination
            page={page}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPaginate={onPaginate}
            isLastPage={isLastPage}
          />
        </div>
      </div>
      <AlertAnalysisSheet isOpen={isSheetOpen} onOpenStateChange={toggleIsAlertAnalysisSheetOpen} />
    </div>
  );
};
