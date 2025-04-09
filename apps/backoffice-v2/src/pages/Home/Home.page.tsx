import { FunctionComponent } from 'react';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { StatisticsMerchantMonitoringDashboard } from './components/StatisticsMerchantMonitoringDashboard/StatisticsMerchantMonitoringDashboard';
import { StatisticsCaseDashboard } from './components/StatisticsCaseDashboard/StatisticsCaseDashboard';

export const Home: FunctionComponent = () => {
  const { firstName, fullName, avatarUrl, customer, isLoadingCustomer, from, to, setDate } =
    useHomeLogic();

  if (isLoadingCustomer || !customer) {
    return <FullScreenLoader />;
  }

  return (
    <DemoAccessWrapper firstName={firstName} fullName={fullName} avatarUrl={avatarUrl}>
      <div className={`p-10 pt-0`}>
        {customer?.config?.isOngoingMonitoringEnabled && (
          <StatisticsMerchantMonitoringDashboard from={from} to={to} setDate={setDate} />
        )}
        {customer?.config?.isOnboardingEnabled && (
          <StatisticsCaseDashboard from={from} to={to} setDate={setDate} />
        )}
      </div>
    </DemoAccessWrapper>
  );
};
