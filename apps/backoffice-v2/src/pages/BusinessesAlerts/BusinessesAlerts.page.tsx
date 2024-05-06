import { AlertsPagination } from '@/pages/BusinessesAlerts/components/AlertsPagination/AlertsPagination';
import { BusinessAlertsTable } from '@/pages/BusinessesAlerts/components/BusinessAlertsTable';
import { NoAlerts } from '@/pages/BusinessesAlerts/components/NoAlerts/NoAlerts';
import { useTransactionMonitoringAlertsLogic } from '@/pages/BusinessesAlerts/hooks/useTransactionMonitoringAlertsLogic/useTransactionMonitoringAlertsLogic';
import { isNonEmptyArray } from '@ballerine/common';
import { Outlet } from 'react-router-dom';
import { AlertsHeader } from 'src/pages/BusinessesAlerts/components/AlertsHeader';

export const BusinessesAlerts = () => {
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

  console.log({ businessAlerts: alerts });

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Businesses Ongoing Monitoring</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <div>
          <AlertsHeader
            assignees={assignees ?? []}
            labels={labels ?? []}
            authenticatedUser={authenticatedUser}
            search={search}
            onSearch={onSearch}
          />
        </div>
        <div className="flex-1">
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
