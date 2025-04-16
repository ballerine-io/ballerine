import { Separator } from '@radix-ui/react-separator';
import qs from 'qs';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { StatsCard } from '@/pages/Home/components/StatsCard/StatsCard';
import { REPORT_TYPE_TO_DISPLAY_TEXT } from '@/pages/MerchantMonitoring/schemas';

export const DynamicMetricsSection = ({
  locale,
  from,
  to,
  setDate,

  isMerchantMonitoringEnabled,
  isOngoingMonitoringEnabled,

  addedMerchantsCount,
  removedMerchantsCount,
}: Pick<
  ReturnType<typeof useHomeLogic>,
  | 'locale'
  | 'isMerchantMonitoringEnabled'
  | 'isOngoingMonitoringEnabled'
  | 'addedMerchantsCount'
  | 'removedMerchantsCount'
> & {
  from: ReturnType<typeof useHomeLogic>['mmFrom'];
  to: ReturnType<typeof useHomeLogic>['mmTo'];
  setDate: ReturnType<typeof useHomeLogic>['setMMDate'];
}) => {
  if (!isMerchantMonitoringEnabled && !isOngoingMonitoringEnabled) {
    return null;
  }

  return (
    <>
      <Separator className="h-[1px] w-full bg-gray-300" />

      <div className="flex items-center justify-between">
        <h3 className={'text-xl font-medium'}>Merchant Monitoring Risk Analytics</h3>

        <DateRangePicker
          toDate={new Date()}
          value={{
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }}
          onChange={setDate}
          className="justify-end"
        />
      </div>

      <div className="grid grid-cols-4 gap-6 2xl:grid-cols-6">
        {isMerchantMonitoringEnabled && (
          <StatsCard
            prefix="+"
            href={`/${locale}/merchant-monitoring?${qs.stringify({
              allowAllDates: !from && !to,
              reportType: REPORT_TYPE_TO_DISPLAY_TEXT.MERCHANT_REPORT_T1,
              from: from ?? undefined,
              to: to ?? undefined,
            })}`}
            count={addedMerchantsCount}
            title="New Merchants"
            description="Merchants added within the selected time range"
          />
        )}

        {isOngoingMonitoringEnabled && (
          <StatsCard
            count={removedMerchantsCount}
            title="Merchants Removed"
            description="Merchants removed from monitoring within the selected time range"
          />
        )}
      </div>
    </>
  );
};
