import React, { FunctionComponent } from 'react';
import { Severity, TSeverity } from '@/common/types';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { ctw } from '@/common/utils/ctw/ctw';
import { severityToClassName, severityToTextClassName } from '@/common/constants';
import { Badge } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { getSeverityFromRiskScore } from '@/common/utils/get-severity-from-risk-score';

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
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <div className={'grid grid-cols-[340px_1fr] gap-8'}>
      <h3 className={'col-span-full text-lg font-bold'}>Summary</h3>
      <Card className={'col-span-full'}>
        <CardHeader className={'pt-4 font-bold'}>
          <span className={'mb-1'}>Overall Risk Level</span>
          <div className="flex items-center space-x-2">
            <TextWithNAFallback
              className={ctw(
                {
                  [severityToTextClassName[
                    (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                  ]]: riskScore || riskScore === 0,
                },
                {
                  // Tailwind does not generate the class when used in a map
                  'text-orange-300': severity === Severity.MEDIUM,
                  'text-destructive': severity === Severity.CRITICAL,
                },
                'text-4xl font-bold',
              )}
              checkFalsy={false}
            >
              {riskScore}
            </TextWithNAFallback>
            {(riskScore || riskScore === 0) && (
              <Badge
                className={ctw(
                  severityToClassName[
                    (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                  ],
                  {
                    // Tailwind does not generate the class when used in a map
                    'bg-orange-100': severity === Severity.MEDIUM,
                    'text-background': severity === Severity.CRITICAL,
                  },
                  'min-w-20 rounded-lg font-bold',
                )}
              >
                {titleCase(severity ?? '')} Risk
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className={'mb-4 font-semibold'}>Merchant Risk Summary</h4>
            <p>{summary ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <RiskIndicatorsSummary riskIndicators={riskIndicators} />
    </div>
  );
};
