import React, { ComponentProps, FunctionComponent } from 'react';
import { getSeverityFromRiskScore, Severity, SeverityType } from '@ballerine/common';
import { ctw, severityToClassName } from '@/common';
import { toTitleCase } from 'string-ts';
import { Badge, Card, CardContent, CardHeader, RiskIndicatorsSummary } from '@/components';
import { TextWithNAFallback } from '@/components/atoms/TextWithNAFallback';

export const BusinessReportSummary: FunctionComponent<{
  summary: string;
  isOnboarding: boolean;
  ongoingMonitoringSummary?: string;
  riskLevels: {
    legalRisk: SeverityType;
    chargebackRisk: SeverityType;
    reputationRisk: SeverityType;
    transactionLaunderingRisk: SeverityType;
  };
  riskIndicators: Array<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }> | null;
  }>;
  riskScore: number;
  homepageScreenshotUrl: string | null;
  Link: ComponentProps<typeof RiskIndicatorsSummary>['Link'];
}> = ({
  riskIndicators,
  summary,
  ongoingMonitoringSummary,
  isOnboarding,
  riskLevels,
  riskScore,
  homepageScreenshotUrl,
  Link,
}) => {
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <div className={'grid grid-cols-5 gap-8'}>
      <Card className={!homepageScreenshotUrl ? 'col-span-full' : 'col-span-3'}>
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
                {toTitleCase(severity ?? '')} Risk
              </Badge>
            )}
          </div>
        </CardHeader>
        {ongoingMonitoringSummary && (
          <CardContent>
            <div>
              <h4 className={'mb-4 font-semibold'}>Ongoing Monitoring Summary</h4>
              <TextWithNAFallback as={'p'} className="whitespace-pre-wrap">
                {ongoingMonitoringSummary}
              </TextWithNAFallback>
            </div>
          </CardContent>
        )}
        <CardContent>
          <div>
            <h4 className={'mb-4 font-semibold'}>
              {isOnboarding && 'Onboarding '}Merchant Risk Summary
            </h4>
            <TextWithNAFallback as={'p'}>{summary}</TextWithNAFallback>
          </div>
        </CardContent>
      </Card>

      {homepageScreenshotUrl && (
        <Card className={'col-span-2 overflow-hidden'}>
          <div className={'relative flex h-full flex-col'}>
            <a
              href={homepageScreenshotUrl}
              target={'_blank'}
              rel={'noreferrer'}
              className={'relative flex-1 overflow-y-auto'}
              title={'Click to view full screenshot'}
            >
              <img
                src={homepageScreenshotUrl}
                alt={'Homepage Screenshot'}
                className={'absolute inset-0 h-auto w-full object-cover object-top'}
              />
            </a>
            <div
              className={
                'top-left-4 absolute rounded border border-white bg-black p-1 text-xs text-white'
              }
            >
              Click to view full screenshot or scroll to explore
            </div>
          </div>
        </Card>
      )}

      <RiskIndicatorsSummary riskIndicators={riskIndicators} Link={Link} />
    </div>
  );
};
