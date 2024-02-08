import { SheetContent } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { AlertAnalysisTable } from '@/pages/TransactionMonitoringAlerts/components/AlertAnalysisSheet/components/AlertAnalysisTable';
import { FunctionComponent } from 'react';

export interface Props {
  isOpen: boolean;
  onOpenStateChange: (isOpen: boolean) => void;
}

export const AlertAnalysisSheet: FunctionComponent<Props> = ({ isOpen, onOpenStateChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenStateChange}>
      <SheetContent side="bottom" style={{ bottom: 0, width: '100%' }}>
        <div className="flex flex-col p-[16px]">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-bold">High Velocity - Inbound - Counterparty</p>
            <div className="mb-10 flex flex-col gap-1">
              <p className="text-sm font-bold">Summary</p>
              <p className="text-sm text-[#64748B]">
                The Customer has received 5 inbound transactions from the same counterparty within 1
                day. which has exceeded
                <br /> the set limit of inbound transactions received from the same Counterparty
                within 1 day.
              </p>
            </div>
          </div>
          <div>
            <AlertAnalysisTable />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
