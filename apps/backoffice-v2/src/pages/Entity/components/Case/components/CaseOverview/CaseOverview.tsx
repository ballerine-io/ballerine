import { RiskIndicatorsSummary } from '@ballerine/ui';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { CaseTabs, TabToLabel } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { camelCase } from 'string-ts';

import { DocumentTracker } from '@/common/components/molecules/DocumentTracker/DocumentTracker';
import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';
import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { CaseVideoGuide } from '@/common/components/molecules/CaseVideoGuide/CaseVideoGuide';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const CaseOverview = ({ processes }: { processes: string[] }) => {
  const { search } = useLocation();
  const { data: workflow } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow });
  const { data: customer } = useCustomerQuery();
  const isDemoOnly = customer?.config?.isDemoAccount;
  const getUpdatedSearchParamsWithActiveTab = useCallback(
    ({ tab }: { tab: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeTab', tab);

      return searchParams.toString();
    },
    [search],
  );
  const riskIndicators = Object.entries(
    workflow?.context?.pluginsOutput?.riskEvaluation?.riskIndicatorsByDomain ??
      workflow?.context?.pluginsOutput?.risk_evaluation?.riskIndicatorsByDomain ??
      {},
  )
    ?.map(([domain, riskIndicators]) => {
      const domainTitle = domain ?? '';
      const tabEntry = Object.entries(TabToLabel).find(([_, label]) => label === domainTitle);
      const tab = tabEntry ? tabEntry[0] : camelCase(domainTitle.toLowerCase());
      const isValidCaseTab = CaseTabs.includes(tab as keyof typeof CaseTabs);

      return {
        title: domain,
        search: isValidCaseTab
          ? getUpdatedSearchParamsWithActiveTab({
              tab: tab,
            })
          : undefined,
        indicators:
          riskIndicators && Array.isArray(riskIndicators)
            ? riskIndicators.map(riskIndicator => ({
                name: riskIndicator.name,
              }))
            : [],
      };
    })
    .sort((a, b) => b.indicators.length - a.indicators.length);

  const isCaseOverviewEnabled = workflow?.workflowDefinition?.config?.isCaseOverviewEnabled;
  const isDocumentTrackerEnabled = workflow?.workflowDefinition?.config?.isDocumentTrackerEnabled;
  const isCaseRiskOverviewEnabled = workflow?.workflowDefinition?.config?.isCaseRiskOverviewEnabled;

  if (!isCaseOverviewEnabled && !isDocumentTrackerEnabled) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {isCaseOverviewEnabled && (
        <>
          {isCaseRiskOverviewEnabled && (
            <OverallRiskLevel
              riskScore={
                workflow?.context?.pluginsOutput?.riskEvaluation?.riskScore ??
                workflow?.context?.pluginsOutput?.risk_evaluation?.riskScore
              }
              riskLevels={{}}
            />
          )}
          <ProcessTracker workflow={workflow} plugins={plugins} processes={processes} />
          {isDocumentTrackerEnabled && <DocumentTracker workflowId={workflow?.id} />}
          {isDemoOnly && !workflow?.workflowDefinition?.config?.disableVideoGuide && (
            <CaseVideoGuide
              title="Onboarding Introduction"
              description="Learn about MiKashBoks onboarding and underwriting capabilities"
            />
          )}
          {isCaseRiskOverviewEnabled && (
            <RiskIndicatorsSummary sections={riskIndicators} Link={RiskIndicatorLink} />
          )}
        </>
      )}
      {!isCaseOverviewEnabled && isDocumentTrackerEnabled && (
        <DocumentTracker workflowId={workflow?.id} />
      )}
    </div>
  );
};
