import { FunctionComponent } from 'react';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { DemoAccessWrapper } from '@/common/components/organisms/DemoAccessWrapper/DemoAccessWrapper';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { DynamicMetricsSection } from './components/DynamicMetricsSection/DynamicMetricsSection';
import { OnboardingCasesRiskAnalytics } from './components/OnboardingCasesRiskAnalytics/OnboardingCasesRiskAnalytics';
import { PortfolioRiskStatistics } from './components/PortfolioRiskStatistics/PortfolioRiskStatistics';
import { StaticMetricsSection } from './components/StaticMetricsSection/StaticMetricsSection';
import { WelcomeSvg } from './components/WelcomeSvg/WelcomeSvg';

export const Home: FunctionComponent = () => {
  const {
    firstName,
    fullName,
    avatarUrl,
    locale,

    isMerchantMonitoringEnabled,
    isOngoingMonitoringEnabled,
    isCasesOnboardingEnabled,

    isLoadingCustomer,
    isLoadingMetrics,
    isLoadingCurrentStats,

    mmFrom,
    mmTo,
    setMMDate,

    casesFrom,
    casesTo,
    setCasesDate,

    casesByStatus,
    ongoingCasesByRisk,
    approvedCasesByRisk,

    totalActiveMerchants,
    addedMerchantsCount,
    removedMerchantsCount,
    riskLevelCounts,
    violationCounts,

    statusConfig,
    ongoingRiskConfig,
    approvedRiskConfig,
    getStatusDefinition,
    getRiskDefinition,
  } = useHomeLogic();

  if (isLoadingCustomer || isLoadingMetrics || isLoadingCurrentStats) {
    return <FullScreenLoader />;
  }

  if (!isMerchantMonitoringEnabled && !isOngoingMonitoringEnabled && !isCasesOnboardingEnabled) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <div className={'m-auto max-w-xl text-center'}>
          <WelcomeSvg />
          <h3 className={'text-lg font-bold'}>Welcome to Ballerine's Risk Management Dashboard!</h3>

          <div>
            <p>Use the sidebar to navigate and start managing your risk flows and processes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DemoAccessWrapper firstName={firstName} fullName={fullName} avatarUrl={avatarUrl}>
      <div className={`space-y-10 p-10 pt-0`}>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          <p className="">
            Get an overview of your portfolio&apos;s activity, risk levels, monitoring alerts, and
            case analytics.
          </p>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Portfolio Analytics</h3>

            <StaticMetricsSection
              isOngoingMonitoringEnabled={isOngoingMonitoringEnabled}
              isCasesOnboardingEnabled={isCasesOnboardingEnabled}
              casesByStatus={casesByStatus}
              ongoingCasesByRisk={ongoingCasesByRisk}
              approvedCasesByRisk={approvedCasesByRisk}
              totalActiveMerchants={totalActiveMerchants}
              statusConfig={statusConfig}
              ongoingRiskConfig={ongoingRiskConfig}
              approvedRiskConfig={approvedRiskConfig}
              getStatusDefinition={getStatusDefinition}
              getRiskDefinition={getRiskDefinition}
            />

            <DynamicMetricsSection
              locale={locale}
              from={mmFrom}
              to={mmTo}
              setDate={setMMDate}
              isMerchantMonitoringEnabled={isMerchantMonitoringEnabled}
              isOngoingMonitoringEnabled={isOngoingMonitoringEnabled}
              addedMerchantsCount={addedMerchantsCount}
              removedMerchantsCount={removedMerchantsCount}
            />
          </div>

          {isMerchantMonitoringEnabled && (
            <PortfolioRiskStatistics
              from={mmFrom}
              to={mmTo}
              riskLevelCounts={riskLevelCounts}
              violationCounts={violationCounts}
            />
          )}
        </div>

        {isCasesOnboardingEnabled && (
          <OnboardingCasesRiskAnalytics from={casesFrom} to={casesTo} setDate={setCasesDate} />
        )}
      </div>
    </DemoAccessWrapper>
  );
};
