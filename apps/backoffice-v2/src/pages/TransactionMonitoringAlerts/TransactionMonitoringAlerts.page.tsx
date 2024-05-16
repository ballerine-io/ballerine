import { AlertsPagination } from '@/pages/TransactionMonitoringAlerts/components/AlertsPagination/AlertsPagination';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { NoAlerts } from '@/pages/TransactionMonitoringAlerts/components/NoAlerts/NoAlerts';
import { useTransactionMonitoringAlertsLogic } from '@/pages/TransactionMonitoringAlerts/hooks/useTransactionMonitoringAlertsLogic/useTransactionMonitoringAlertsLogic';
import { isNonEmptyArray } from '@ballerine/common';
import { Outlet } from 'react-router-dom';
import { AlertsHeader } from 'src/pages/TransactionMonitoringAlerts/components/AlertsHeader';

export const TransactionMonitoringAlerts = () => {
  const {
    alerts,
    isLoadingAlerts,
    assignees,
    correlationIds,
    authenticatedUser,
    page,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
    search,
    onSearch,
  } = useTransactionMonitoringAlertsLogic();

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Transaction Monitoring Alerts</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <AlertsHeader
          assignees={assignees ?? []}
          correlationIds={correlationIds ?? []}
          authenticatedUser={authenticatedUser}
          search={search}
          onSearch={onSearch}
        />
        {isNonEmptyArray(alerts) && <AlertsTable data={alerts ?? []} />}
        {Array.isArray(alerts) && !alerts.length && !isLoadingAlerts && <NoAlerts />}
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
      <Outlet />
    </div>
  );
};
