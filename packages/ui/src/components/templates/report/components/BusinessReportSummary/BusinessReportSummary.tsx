import {
  MERCHANT_REPORT_RISK_LEVELS_MAP,
  MerchantReportRiskLevel,
  RiskIndicatorSchema,
} from '@ballerine/common';
import { ComponentProps, FunctionComponent } from 'react';
import ReactMarkdown from 'react-markdown';
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
              <TextWithNAFallback
                as={'div'}
                className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
              >
                {ongoingMonitoringSummary && (
                  <div className="space-y-3 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="my-1.5" {...props} />,
                        h3: ({ node, ...props }) => (
                          <h3 className="text-lg font-semibold" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 my-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 my-2" {...props} />
                        ),
                        li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                      }}
                    >
                      {ongoingMonitoringSummary}
                    </ReactMarkdown>
                  </div>
                )}
              </TextWithNAFallback>
            </div>
          </CardContent>
        )}
        <CardContent>
          <div>
            <h4 className={'mb-4 font-semibold'}>
              {ongoingMonitoringSummary && 'Onboarding '}Merchant Risk Summary
            </h4>
            <TextWithNAFallback
              as={'div'}
              className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
            >
              {summary && (
                <div className="space-y-3 leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="my-1.5" {...props} />,
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold" {...props} />
                      ),
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 my-2" {...props} />
                      ),
                      li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                </div>
              )}
            </TextWithNAFallback>
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
