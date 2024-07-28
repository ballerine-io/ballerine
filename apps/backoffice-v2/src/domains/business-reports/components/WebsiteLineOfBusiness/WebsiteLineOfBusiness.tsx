import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { z } from 'zod';

const ViolationsSchema = z.array(
  z.object({
    label: z.string(),
    severity: z.string(),
    explanation: z.string(),
    screenshot: z.object({
      screenshotUrl: z.string(),
    }),
    sourceUrl: z.string(),
  }),
);

export const WebsiteLineOfBusiness: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  description: string;
  detectedMcc: string | null;
}> = ({ violations, description, detectedMcc }) => {
  const parsedViolationsResult = ViolationsSchema.safeParse(violations);

  return (
    <div className={'space-y-8'}>
      <h3 className={'col-span-full text-lg font-bold'}>Website Line of Business Analysis</h3>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Line of Business Summary</CardHeader>
        <CardContent className={'flex flex-col space-y-4'}>
          <div>
            <h4 className={'mb-4 font-semibold'}>LOB Description</h4>
            <p
              className={ctw({
                'text-slate-400': !description,
              })}
            >
              {description || 'Not provided'}
            </p>
          </div>
        </CardContent>

        {detectedMcc && (
          <div>
            <CardContent className={'flex flex-col space-y-4'}>
              <div>
                <h4 className={'mb-4 font-semibold'}>Detected MCC</h4>
                <p>{detectedMcc}</p>
              </div>
            </CardContent>
          </div>
        )}
      </Card>
      {parsedViolationsResult.success && parsedViolationsResult.data.length > 0 && (
        <Card>
          <CardHeader className={'pt-4 font-bold'}>Content Violations Summary</CardHeader>
          <CardContent className={'flex flex-col space-y-4'}>
            <h4 className={'font-bold'}>Findings</h4>
            {parsedViolationsResult.data.map(violation => (
              <div key={violation.label} className={'flex flex-col space-y-2'}>
                <div className={'font-semibold'}>{violation.label}</div>
                {violation.explanation && <p>{violation.explanation}</p>}
                {violation.screenshot && (
                  <a
                    href={violation.screenshot.screenshotUrl}
                    target={'_blank'}
                    rel={'noreferrer'}
                    className={'relative w-1/2'}
                    title={'Click to view full screenshot'}
                  >
                    <img
                      src={violation.screenshot.screenshotUrl}
                      alt={`${violation.label} screenshot of the website`}
                      className={'h-auto max-h-[400px] w-full object-cover object-top'}
                    />
                    <div
                      className={
                        'absolute rounded border border-white bg-black p-1 text-xs text-white bottom-right-4'
                      }
                    >
                      Click to view full screenshot
                    </div>
                  </a>
                )}
                <div className={'text-sm italic'}>
                  Source:{' '}
                  <a
                    href={violation.sourceUrl}
                    target={'_blank'}
                    rel={'noreferrer'}
                    className={'link text-blue-500'}
                  >
                    {violation.sourceUrl}
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
