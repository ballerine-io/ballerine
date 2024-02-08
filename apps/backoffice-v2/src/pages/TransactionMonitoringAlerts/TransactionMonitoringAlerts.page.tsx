import { Pagination } from '@/common/components/molecules/Pagination/Pagination';
import { PaginationContent } from '@/common/components/molecules/Pagination/Pagination.Content';
import { PaginationEllipsis } from '@/common/components/molecules/Pagination/Pagination.Ellipsis';
import { PaginationFirst } from '@/common/components/molecules/Pagination/Pagination.First';
import { PaginationItem } from '@/common/components/molecules/Pagination/Pagination.Item';
import { PaginationLast } from '@/common/components/molecules/Pagination/Pagination.Last';
import { PaginationLink } from '@/common/components/molecules/Pagination/Pagination.Link';
import { PaginationNext } from '@/common/components/molecules/Pagination/Pagination.Next';
import { PaginationPrevious } from '@/common/components/molecules/Pagination/Pagination.Previous';
import { useAlertsQuery } from '@/domains/alerts/hooks/queries/useAlertsQuery/useAlertsQuery';
import { AlertAnalysisSheet } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { Header } from 'src/pages/TransactionMonitoringAlerts/components/Header';
import { useToggle } from '@/common/hooks/useToggle/useToggle';

export const useTransactionMonitoringAlertsLogic = () => {
  const { data: alerts } = useAlertsQuery({
    filter: {},
    page: 1,
    pageSize: 10,
    search: '',
    sortDir: 'asc',
    sortBy: 'createdAt',
  });
  const [isSheetOpen, toggleIsAlertAnalysisSheetOpen, toggleOnIsAlertAnalysisSheetOpen] =
    useToggle();

  return {
    alerts,
    isSheetOpen,
    toggleOnIsAlertAnalysisSheetOpen,
    toggleIsAlertAnalysisSheetOpen,
  };
};

export const TransactionMonitoringAlerts = () => {
  const { alerts, isSheetOpen, toggleOnIsAlertAnalysisSheetOpen, toggleIsAlertAnalysisSheetOpen } =
    useTransactionMonitoringAlertsLogic();

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Transaction Monitoring Alerts</h1>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <Header />
        <AlertsTable
          data={alerts}
          toggleOnIsAlertAnalysisSheetOpen={toggleOnIsAlertAnalysisSheetOpen}
        />
        <div className={`flex items-center gap-x-2`}>
          <span className={`min-w-fit text-sm font-semibold`}>
            Page {1} of {10}
          </span>
          <Pagination className={`justify-start`}>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext to="#" iconOnly />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast to="#" iconOnly />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <AlertAnalysisSheet isOpen={isSheetOpen} onOpenStateChange={toggleIsAlertAnalysisSheetOpen} />
    </div>
  );
};
