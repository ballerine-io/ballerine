import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useProcessTrackerBlock } from '@/lib/blocks/hooks/useProcessTrackerBlock/useProcessTrackerBlock';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';
import React, { useCallback } from 'react';
import { titleCase } from 'string-ts';
import { toRiskLabels } from '@/domains/business-reports/adapters/report-adapter/report-adapter';
import { CaseTabs } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { useLocation } from 'react-router-dom';

export const useCaseOverviewBlock = () => {
  const { search } = useLocation();
  const { data: workflow } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow });
  const processTrackerBlock = useProcessTrackerBlock({
    workflow,
    plugins,
    processes: DEFAULT_PROCESS_TRACKER_PROCESSES,
  });
  const getUpdatedSearchParamsWithActiveTab = useCallback(
    ({ tab }: { tab: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeTab', tab);

      return searchParams.toString();
    },
    [search],
  );
  const riskIndicators = Object.entries(
    workflow?.context?.pluginsOutput?.risk?.data?.summary?.riskIndicatorsByDomain ?? {},
  )?.map(([domain, riskIndicators]) => {
    const isValidCaseTab = CaseTabs.includes(domain);

    return {
      title: titleCase(domain ?? ''),
      search: isValidCaseTab
        ? getUpdatedSearchParamsWithActiveTab({
            tab: domain,
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
  const overallRiskLevelBlock = createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: (
        <OverallRiskLevel
          riskScore={workflow?.context?.pluginsOutput?.risk?.data?.summary?.riskScore}
          riskLevels={workflow?.context?.pluginsOutput?.risk?.data?.summary?.riskLevels}
        />
      ),
    })
    .build();
  const riskIndicatorsBlock = createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: <RiskIndicatorsSummary riskIndicators={riskIndicators} />,
    })
    .build();

  return createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'container',
      props: {
        className: 'grid grid-cols-4 gap-4',
      },
      value: [
        ...overallRiskLevelBlock.flat(1),
        ...processTrackerBlock.flat(1),
        ...riskIndicatorsBlock.flat(1),
      ],
    })
    .build();
};
