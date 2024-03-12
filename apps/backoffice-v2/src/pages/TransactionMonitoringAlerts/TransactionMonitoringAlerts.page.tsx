import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { AlertsHeader } from 'src/pages/TransactionMonitoringAlerts/components/AlertsHeader';
import { AlertsPagination } from '@/pages/TransactionMonitoringAlerts/AlertsPagination/AlertsPagination';
import { useTransactionMonitoringAlertsLogic } from '@/pages/TransactionMonitoringAlerts/hooks/useTransactionMonitoringAlertsLogic/useTransactionMonitoringAlertsLogic';
import { Outlet } from 'react-router-dom';
import { isNonEmptyArray } from '@ballerine/common';
import { NoAlerts } from '@/pages/TransactionMonitoringAlerts/components/NoAlerts/NoAlerts';

export const TransactionMonitoringAlerts = () => {
  const {
    alerts,
    isLoadingAlerts,
    assignees,
    labels,
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
          labels={labels ?? []}
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
