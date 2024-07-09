import { useLocation } from 'react-router-dom';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import React, { useCallback } from 'react';
import { CaseTabs } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { camelCase, titleCase } from 'string-ts';
import { toRiskLabels } from '@/domains/business-reports/adapters/report-adapter/report-adapter';
import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';
import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';

export const CaseOverview = ({ processes }: { processes: string[] }) => {
  const { search } = useLocation();
  const { data: workflow } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow });
  const getUpdatedSearchParamsWithActiveTab = useCallback(
    ({ tab }: { tab: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeTab', tab);

      return searchParams.toString();
    },
    [search],
  );
  const riskIndicators = Object.entries(
    workflow?.context?.pluginsOutput?.risk_evaluation?.riskIndicatorsByDomain ?? {},
  )?.map(([domain, riskIndicators]) => {
    const tab = camelCase(domain);
    const isValidCaseTab = CaseTabs.includes(tab);

    return {
      title: titleCase(domain ?? ''),
      search: isValidCaseTab
        ? getUpdatedSearchParamsWithActiveTab({
            tab: tab,
          })
        : undefined,
      violations: toRiskLabels(riskIndicators),
    };
  }) satisfies Array<{
    title: string;
    search: string | undefined;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;

  if (!workflow?.workflowDefinition?.config?.isCaseOverviewEnabled) {
    return;
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
      {workflow?.workflowDefinition?.config?.isCaseRiskOverviewEnabled && (
        <OverallRiskLevel
          riskScore={workflow?.context?.pluginsOutput?.risk_evaluation?.riskScore}
          riskLevels={{
            transactionLaunderingRisk: '',
            legalRisk: '',
            chargebackRisk: '',
            reputationRisk: '',
          }}
        />
      )}
      <ProcessTracker workflow={workflow} plugins={plugins} processes={processes} />
      {workflow?.workflowDefinition?.config?.isCaseRiskOverviewEnabled && (
        <RiskIndicatorsSummary riskIndicators={riskIndicators} />
      )}
    </div>
  );
};
