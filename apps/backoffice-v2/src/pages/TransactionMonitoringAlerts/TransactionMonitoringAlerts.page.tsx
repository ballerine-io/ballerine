import { Pagination } from '@/common/components/organisms/Pagination/Pagination';
import { AlertsTable } from '@/pages/TransactionMonitoringAlerts/components/AlertsTable';
import { Controls } from '@/pages/TransactionMonitoringAlerts/components/Controls';
import { Filters } from '@/pages/TransactionMonitoringAlerts/components/Filters';

export const TransactionMonitoringAlerts = () => {
  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-10">
      <h1 className="pb-5 text-2xl font-bold">Transaction Monitoring Alerts</h1>
      <div className="pb-8">
        <Filters />
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-auto">
        <Controls />
        <AlertsTable />
        <div className="flex justify-start">
          <Pagination onPaginate={() => () => {}} page={1} totalPages={10} />
        </div>
      </div>
    </div>
  );
};
