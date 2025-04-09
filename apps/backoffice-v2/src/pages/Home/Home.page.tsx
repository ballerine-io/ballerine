import { FunctionComponent } from 'react';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { StatisticsCaseDashboard } from './components/StatisticsCaseDashboard/StatisticsCaseDashboard';
import { StatisticsMerchantMonitoringDashboard } from './components/StatisticsMerchantMonitoringDashboard/StatisticsMerchantMonitoringDashboard';
import dayjs from 'dayjs';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';

export const Home: FunctionComponent = () => {
  const { firstName, fullName, avatarUrl, customer, isLoadingCustomer, from, to, setDate } =
    useHomeLogic();

  if (isLoadingCustomer || !customer?.config) {
    return <FullScreenLoader />;
  }

  return (
    <DemoAccessWrapper firstName={firstName} fullName={fullName} avatarUrl={avatarUrl}>
      <div className={`space-y-10 p-10 pt-0`}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Statistics</h1>
          {customer.config.isMerchantMonitoringEnabled && (
            <DateRangePicker
              toDate={new Date()}
              value={{
                from: from ? dayjs(from).toDate() : undefined,
                to: to ? dayjs(to).toDate() : undefined,
              }}
              onChange={setDate}
            />
          )}
        </div>

        {customer.config.isMerchantMonitoringEnabled && (
          <StatisticsMerchantMonitoringDashboard from={from} to={to} setDate={setDate} />
        )}

        {customer.config.isCasesOnboardingEnabled && (
          <StatisticsCaseDashboard
            from={from}
            to={to}
            setDate={setDate}
            // Don't show another datepicker, already have one in StatisticsMerchantMonitoringDashboard
            shouldShowDatePicker={!customer.config.isMerchantMonitoringEnabled}
          />
        )}
      </div>
    </DemoAccessWrapper>
  );
};
