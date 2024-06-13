import React, { FunctionComponent } from 'react';
import { TSeverity } from '@/common/types';
import { TitleAndParagraph } from '@/common/components/molecules/TitleAndParagraph/TitleAndParagraph';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';

import { OverallRiskLevel } from '@/common/components/molecules/OverallRiskLevel/OverallRiskLevel';

export const BusinessReportSummary: FunctionComponent<{
  summary: string;
  riskLevels: {
    legalRisk: TSeverity;
    chargebackRisk: TSeverity;
    reputationRisk: TSeverity;
    transactionLaunderingRisk: TSeverity;
  };
  riskIndicators: Array<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;
  riskScore: number;
}> = ({ riskIndicators, summary, riskLevels, riskScore }) => {
  return (
    <div className={'grid grid-cols-[340px_1fr] gap-8'}>
      <OverallRiskLevel riskScore={riskScore} riskLevels={riskLevels} />
      <TitleAndParagraph
        title={'Merchant Risk Summary'}
        paragraph={summary ?? 'No summary found.'}
      />
      <RiskIndicatorsSummary riskIndicators={riskIndicators} />
    </div>
  );
};
