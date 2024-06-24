import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useProcessTrackerBlock } from '@/lib/blocks/hooks/useProcessTrackerBlock/useProcessTrackerBlock';
import { DEFAULT_PROCESS_TRACKER_PROCESSES } from '@/common/components/molecules/ProcessTracker/constants';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';
import React from 'react';

export const useCaseOverviewBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow });
  const processTrackerBlock = useProcessTrackerBlock({
    workflow,
    plugins,
    processes: DEFAULT_PROCESS_TRACKER_PROCESSES,
  });
  const overallRiskLevelBlock = createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: (
        <OverallRiskLevel
          riskScore={85}
          riskLevels={{
            transactionLaunderingRisk: 'low',
            legalRisk: 'low',
            chargebackRisk: 'low',
            reputationRisk: 'low',
          }}
        />
      ),
    })
    .build();
  const riskIndicatorsBlock = createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'node',
      value: (
        <RiskIndicatorsSummary
          riskIndicators={[
            {
              title: 'Company Info',
              search: '?activeTab=company-info',
              violations: [
                {
                  label: 'IP Rights Infringement',
                  severity: 'critical',
                },
              ],
            },
            {
              title: 'Associated Companies',
              search: '?activeTab=associated-companies',
              violations: [
                {
                  label: 'Inconsistent Line of Business',
                  severity: 'high',
                },
                {
                  label: 'Scam & Fraud indications',
                  severity: 'high',
                },
              ],
            },
            {
              title: 'Store Info',
              search: '?activeTab=store-info',
              violations: [
                {
                  label: 'Complaints about scams',
                  severity: 'high',
                },
                {
                  label: 'Low ratings on reputation platforms',
                  severity: 'high',
                },
              ],
            },
            {
              title: 'Directors',
              search: '?activeTab=directors',
              violations: [],
            },
            {
              title: 'Documents',
              search: '?activeTab=documents',
              violations: [],
            },
            {
              title: 'Monitoring Report',
              search: '?activeTab=website-monitoring',
              violations: [
                {
                  label: 'Inconsistent Line of Business',
                  severity: 'high',
                },
                {
                  label: 'Scam & Fraud indications',
                  severity: 'high',
                },
              ],
            },
            {
              title: 'UBOs',
              search: '?activeTab=ubos',
              violations: [
                {
                  label: 'Inconsistent Line of Business',
                  severity: 'high',
                },
              ],
            },
          ]}
        />
      ),
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
