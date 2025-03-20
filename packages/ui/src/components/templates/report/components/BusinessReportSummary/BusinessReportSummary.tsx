import {
  MERCHANT_REPORT_RISK_LEVELS_MAP,
  MerchantReportRiskLevel,
  RiskIndicatorSchema,
} from '@ballerine/common';
import { ComponentProps, FunctionComponent } from 'react';
import { toTitleCase } from 'string-ts';
import { z } from 'zod';

import { ctw, severityToClassName } from '@/common';
import { Badge, Card, CardContent, CardHeader, RiskIndicatorsSummary } from '@/components';
import { TextWithNAFallback } from '@/components/atoms/TextWithNAFallback';

export const BusinessReportSummary: FunctionComponent<{
  summary: string;
  ongoingMonitoringSummary?: string;
  riskIndicators: ReadonlyArray<{
    title: string;
    search?: string;
    indicators: Array<z.infer<typeof RiskIndicatorSchema>> | null;
  }>;
  riskLevel: MerchantReportRiskLevel | null;
  homepageScreenshotUrl: string | null;
  Link?: ComponentProps<typeof RiskIndicatorsSummary>['Link'];
}> = ({
  riskIndicators,
  summary,
  ongoingMonitoringSummary,
  riskLevel,
  homepageScreenshotUrl,
  Link,
}) => {
  return (
    <div className={'grid grid-cols-5 gap-x-8 gap-y-6'}>
      <Card className={!homepageScreenshotUrl ? 'col-span-full' : 'col-span-3'}>
        <CardHeader className={'pt-4 font-bold'}>
          <span className={'mb-1'}>Overall Risk Level</span>
          <div className="flex items-center space-x-2">
            {riskLevel && (
              <Badge
                className={ctw(
                  severityToClassName[riskLevel],
                  {
                    'text-background': riskLevel === MERCHANT_REPORT_RISK_LEVELS_MAP.critical,
                  },
                  'min-w-20 rounded-lg font-bold',
                )}
              >
                {toTitleCase(riskLevel)} Risk
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
              {ongoingMonitoringSummary && 'Onboarding '}Merchant Risk Summary
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
                key={homepageScreenshotUrl}
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

      <RiskIndicatorsSummary sections={riskIndicators} Link={Link} />
    </div>
  );
};
