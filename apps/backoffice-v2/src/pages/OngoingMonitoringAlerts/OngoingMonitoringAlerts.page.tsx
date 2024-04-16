import { OngoingMonitoringAlertsTable } from '@/pages/OngoingMonitoringAlerts/components/OngoingMonitoringAlertsTable/OngoingMonitoringAlertsTable';
import { FunctionComponent } from 'react';
import { Outlet } from 'react-router-dom';

export const OngoingMonitoringAlertsPage: FunctionComponent = () => {
  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Business Ongoing Monitoring</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        {/* <AlertsHeader
          assignees={[]}
          labels={[]}
          authenticatedUser={authenticatedUser}
          search={search}
          onSearch={onSearch}
        /> */}
        {<OngoingMonitoringAlertsTable data={[]} />}
        {/* {Array.isArray(alerts) && !alerts.length && !isLoadingAlerts && <NoAlerts />} */}
        {/* <div className={`flex items-center gap-x-2`}>
          <AlertsPagination
            page={page}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onPaginate={onPaginate}
            isLastPage={isLastPage}
          />
        </div> */}
      </div>
      <Outlet />
    </div>
  );
};
