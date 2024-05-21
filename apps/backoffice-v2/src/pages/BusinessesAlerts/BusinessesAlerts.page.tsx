import { BusinessAlertsTable } from '@/pages/BusinessesAlerts/components/BusinessAlertsTable';
import { useBusinessAlertsLogic } from '@/pages/BusinessesAlerts/hooks/useBusinessAlertsLogic/useBusinessAlertsLogic';
import { AlertsHeader } from '@/pages/TransactionMonitoringAlerts/components/AlertsHeader';
import { AlertsPagination } from '@/pages/TransactionMonitoringAlerts/components/AlertsPagination/AlertsPagination';
import { NoAlerts } from '@/pages/TransactionMonitoringAlerts/components/NoAlerts/NoAlerts';
import { isNonEmptyArray } from '@ballerine/common';
import { Outlet } from 'react-router-dom';

export const BusinessesAlerts = () => {
  const {
    alerts,
    isLoadingAlerts,
    assignees,
    authenticatedUser,
    page,
    correlationIds,
    onPrevPage,
    onNextPage,
    onPaginate,
    isLastPage,
    search,
    onSearch,
  } = useBusinessAlertsLogic();

  return (
    <div className="flex h-screen flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Businesses Ongoing Monitoring</h1>
      <div className="flex h-full flex-col gap-6 overflow-auto">
        <div>
          <AlertsHeader
            assignees={assignees ?? []}
            authenticatedUser={authenticatedUser}
            search={search}
            correlationIds={correlationIds ?? []}
            onSearch={onSearch}
          />
        </div>
        <div className="flex-1 overflow-auto">
          {isNonEmptyArray(alerts) && <BusinessAlertsTable data={alerts ?? []} />}
          {Array.isArray(alerts) && !alerts.length && !isLoadingAlerts && <NoAlerts />}
        </div>
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
