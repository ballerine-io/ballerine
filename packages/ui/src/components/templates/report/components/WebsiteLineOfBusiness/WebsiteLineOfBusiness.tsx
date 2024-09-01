import React, { FunctionComponent } from 'react';
import { ctw } from '@/common';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { Card, CardContent, CardHeader } from '@/components';

export const WebsiteLineOfBusiness: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
    explanation: string;
    screenshotUrl: string;
    sourceUrl: string;
  }>;
  description: string;
  formattedMcc: string | null;
}> = ({ violations, description, formattedMcc }) => {
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
          {formattedMcc && (
            <div className={'flex flex-col'}>
              <h4 className={'mb-4 font-semibold'}>MCC Classification</h4>
              <p>{formattedMcc}</p>
            </div>
          )}
        </CardContent>
      </Card>
      {!!violations.length && (
        <Card>
          <CardHeader className={'pt-4 font-bold'}>Content Violations Summary</CardHeader>
          <CardContent className={'flex flex-col space-y-4'}>
            <h4 className={'font-semibold'}>Findings</h4>
            {violations.map(violation => (
              <div key={violation.label} className={'flex flex-col space-y-2'}>
                <h5 className={'font-semibold'}>{violation.label}</h5>
                {violation.explanation && <p>{violation.explanation}</p>}
                {violation.screenshotUrl && (
                  <a
                    href={violation.screenshotUrl}
                    target={'_blank'}
                    rel={'noreferrer'}
                    className={'relative w-1/2'}
                    title={'Click to view full screenshot'}
                  >
                    <img
                      src={violation.screenshotUrl}
                      alt={`${violation.label} screenshot of the website`}
                      className={'h-auto max-h-[400px] w-full object-cover object-top'}
                    />
                    <div
                      className={
                        'absolute bottom-4 right-4 rounded border border-white bg-black p-1 text-xs text-white'
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
