import React, { FunctionComponent } from 'react';
import { Severity, TSeverity } from '@/common/types';
import { RiskIndicatorsSummary } from '@/common/components/molecules/RiskIndicatorsSummary/RiskIndicatorsSummary';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { severityToClassName } from '@/common/constants';
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
  homepageScreenshotUrl: string | null;
}> = ({ riskIndicators, summary, riskLevels, riskScore, homepageScreenshotUrl }) => {
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <div className={'grid grid-cols-[60%_40%] gap-8'}>
      <Card className={!homepageScreenshotUrl ? 'col-span-full' : ''}>
        <CardHeader className={'pt-4 font-bold'}>
          <span className={'mb-1'}>Overall Risk Level</span>
          <div className="flex items-center space-x-2">
            {(riskScore || riskScore === 0) && (
              <Badge
                className={ctw(
                  severityToClassName[
                    (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                  ],
                  {
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
      {homepageScreenshotUrl && (
        <Card className={'overflow-hidden'}>
          <a
            href={homepageScreenshotUrl}
            target={'_blank'}
            rel={'noreferrer'}
            className={'flex h-full min-h-[300px] w-full flex-col'}
            title={'Click to view full screenshot'}
          >
            <span className="relative flex-grow">
              <img
                src={homepageScreenshotUrl}
                alt={'Homepage Screenshot'}
                className={'absolute inset-0 h-full w-full object-cover object-top'}
              />
              <div
                className={
                  'absolute rounded border border-white bg-black p-1 text-xs text-white bottom-right-4'
                }
              >
                Click to view full screenshot
              </div>
            </span>
          </a>
        </Card>
      )}
      <RiskIndicatorsSummary riskIndicators={riskIndicators} />
    </div>
  );
};
