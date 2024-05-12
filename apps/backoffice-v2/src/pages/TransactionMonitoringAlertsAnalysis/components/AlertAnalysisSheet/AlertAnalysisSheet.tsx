import { SheetContent } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import React, { FunctionComponent, ReactNode } from 'react';
import { TTransactionsList } from '@/domains/transactions/fetchers';
import { ExpandedTransactionDetails } from '@/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet/ExpandedTransactionDetails';
import { columns } from '@/pages/TransactionMonitoringAlertsAnalysis/components/AlertAnalysisSheet/columns';
import { DataTable } from '@/common/components/molecules/DataTable/DataTable';

export interface IAlertAnalysisProps {
  onOpenStateChange: () => void;
  transactions: TTransactionsList;
  heading: ReactNode;
  summary: ReactNode;
}

export const AlertAnalysisSheet: FunctionComponent<IAlertAnalysisProps> = ({
  onOpenStateChange,
  transactions,
  heading,
  summary,
}) => {
  return (
    <Sheet defaultOpen onOpenChange={onOpenStateChange}>
      <SheetContent side="bottom" className={`bottom-0 w-full`}>
        <div className="flex flex-col p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{heading}</h2>
            <div className="mb-10 flex flex-col gap-1">
              <h3 className="text-sm font-bold">Summary</h3>
              <div className="max-w-[88ch] text-sm text-[#64748B]">{summary}</div>
            </div>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={transactions}
              props={{ scroll: { className: 'h-[47vh]' } }}
              CollapsibleComponent={({ row: transaction }) => (
                <ExpandedTransactionDetails transaction={transaction} />
              )}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
