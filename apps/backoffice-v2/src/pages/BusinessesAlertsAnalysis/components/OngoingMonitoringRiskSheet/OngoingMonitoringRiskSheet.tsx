import { SheetContent } from '@/common/components/atoms/Sheet';
import { Sheet } from '@/common/components/atoms/Sheet/Sheet';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { OngoingMonitoringTable } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringTable';
import { FunctionComponent } from 'react';

export interface IOngoingMonitoringRiskSheet {
  onOpenStateChange: () => void;
  businessReports: TBusinessReport[];
}

export const OngoingMonitoringRiskSheet: FunctionComponent<IOngoingMonitoringRiskSheet> = ({
  onOpenStateChange,
  businessReports,
}) => {
  return (
    <Sheet defaultOpen onOpenChange={onOpenStateChange}>
      <SheetContent side="bottom" className={`bottom-0 w-full`}>
        <div className="flex flex-col p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Ongoing monitoring risk change</h2>
            <div className="mb-10 flex flex-col gap-1">
              <h3 className="text-sm font-bold">Summary</h3>
              <p className="max-w-[88ch] text-sm text-[#64748B]">
                The ongoing monitoring has detected new violations on the merchant, that have raised
                its risk score. <br />
                Please review the violations and resolve.{' '}
              </p>
            </div>
          </div>
          <div>
            <OngoingMonitoringTable businessReports={businessReports ?? []} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
