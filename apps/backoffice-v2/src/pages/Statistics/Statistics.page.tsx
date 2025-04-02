import { Loader2 } from 'lucide-react';
import { FunctionComponent } from 'react';

import { StatisticsCaseDashboard } from './components/StatisticsCaseDashboard/StatisticsCaseDashboard';
import { useStatisticsLogic } from './hooks/useStatisticsLogic';
import { StatisticsMerchantMonitoringDashboard } from './components/StatisticsMerchantMonitoringDashboard/StatisticsMerchantMonitoringDashboard';

export const Statistics: FunctionComponent = () => {
  const { customer, isLoadingCustomer, from, to, setDate } = useStatisticsLogic();

  if (isLoadingCustomer || !customer) {
    return <Loader2 className="w-4 animate-spin" />;
  }

  if (customer?.config?.isOngoingMonitoringEnabled) {
    return <StatisticsMerchantMonitoringDashboard from={from} to={to} setDate={setDate} />;
  }

  return <StatisticsCaseDashboard from={from} to={to} setDate={setDate} />;
};
