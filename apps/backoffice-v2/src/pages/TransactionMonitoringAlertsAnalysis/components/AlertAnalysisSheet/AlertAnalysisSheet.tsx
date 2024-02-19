import { SheetContent } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { AlertAnalysisTable } from 'src/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisTable';
import { FunctionComponent } from 'react';
import { TTransactionsList } from '@/domains/transactions/fetchers';

export interface IAlertAnalysisProps {
  onOpenStateChange: () => void;
  transactions: TTransactionsList;
}

export const AlertAnalysisSheet: FunctionComponent<IAlertAnalysisProps> = ({
  onOpenStateChange,
  transactions,
}) => {
  return (
    <Sheet defaultOpen onOpenChange={onOpenStateChange}>
      <SheetContent side="bottom" className={`bottom-0 w-full`}>
        <div className="flex flex-col p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">High Velocity - Inbound - Counterparty</h2>
            <div className="mb-10 flex flex-col gap-1">
              <h3 className="text-sm font-bold">Summary</h3>
              <p className="max-w-[88ch] text-sm text-[#64748B]">
                The Customer has received 5 inbound transactions from the same counterparty within 1
                day. which has exceeded the set limit of inbound transactions received from the same
                Counterparty within 1 day.
              </p>
            </div>
          </div>
          <div>
            <AlertAnalysisTable transactions={transactions ?? []} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
