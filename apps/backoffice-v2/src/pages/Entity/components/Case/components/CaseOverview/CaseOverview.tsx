import { RiskIndicatorSchema } from '@ballerine/common';
import { RiskIndicatorsSummary } from '@ballerine/ui';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { camelCase, titleCase } from 'string-ts';
import { z } from 'zod';

import { DocumentTracker } from '@/common/components/molecules/DocumentTracker/DocumentTracker';
import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';
import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { CaseTabs, TabToLabel } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';

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
    workflow?.context?.pluginsOutput?.riskEvaluation?.riskIndicatorsByDomain ??
      workflow?.context?.pluginsOutput?.risk_evaluation?.riskIndicatorsByDomain ??
      {},
  )?.map(([domain, riskIndicators]) => {
    const tab = camelCase(domain.toLowerCase());
    const isValidCaseTab = CaseTabs.includes(tab);

    return {
      title: TabToLabel[tab as keyof typeof TabToLabel] ?? titleCase(domain ?? ''),
      search: isValidCaseTab
        ? getUpdatedSearchParamsWithActiveTab({
            tab: tab,
          })
        : undefined,
      riskIndicators:
        riskIndicators && Array.isArray(riskIndicators)
          ? riskIndicators.map((riskIndicator: z.infer<typeof RiskIndicatorSchema>) => ({
              name: riskIndicator.name,
            }))
          : [],
    };
  });

  if (!workflow?.workflowDefinition?.config?.isCaseOverviewEnabled) {
    return;
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-3">
      {workflow?.workflowDefinition?.config?.isCaseRiskOverviewEnabled && (
        <OverallRiskLevel
          riskScore={
            workflow?.context?.pluginsOutput?.riskEvaluation?.riskScore ??
            workflow?.context?.pluginsOutput?.risk_evaluation?.riskScore
          }
          riskLevels={{}}
        />
      )}
      <ProcessTracker workflow={workflow} plugins={plugins} processes={processes} />
      {workflow?.workflowDefinition?.config?.isDocumentTrackerEnabled && (
        <DocumentTracker workflow={workflow} plugins={plugins} />
      )}
      {workflow?.workflowDefinition?.config?.isCaseRiskOverviewEnabled && (
        <RiskIndicatorsSummary sections={riskIndicators} Link={RiskIndicatorLink} />
      )}
    </div>
  );
};
