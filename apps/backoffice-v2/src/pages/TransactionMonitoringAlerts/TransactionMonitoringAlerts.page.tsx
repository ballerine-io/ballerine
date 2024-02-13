import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { AlertsHeader } from 'src/pages/TransactionMonitoringAlerts/components/AlertsHeader';
import { AlertsPagination } from '@/pages/TransactionMonitoringAlerts/AlertsPagination/AlertsPagination';
import { useTransactionMonitoringAlertsLogic } from '@/pages/TransactionMonitoringAlerts/hooks/useTransactionMonitoringAlertsLogic/useTransactionMonitoringAlertsLogic';

export const TransactionMonitoringAlerts = () => {
  const {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
    assignees,
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
          authenticatedUser={authenticatedUser}
          search={search}
          onSearch={onSearch}
        />
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
