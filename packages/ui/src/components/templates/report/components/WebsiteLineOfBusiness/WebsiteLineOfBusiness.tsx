import { RiskIndicatorSchema } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { z } from 'zod';

import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';

export const WebsiteLineOfBusiness: FunctionComponent<{
  riskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  lineOfBusinessDescription: string | null;
  mcc: string | null;
  mccDescription: string | null;
}> = ({ riskIndicators, lineOfBusinessDescription, mcc, mccDescription }) => {
  return (
    <div className={'space-y-6'}>
      <RiskIndicators riskIndicators={riskIndicators} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Line of Business Summary</CardHeader>
        <CardContent className={'flex flex-col space-y-4'}>
          <div>
            <ContentTooltip
              description={
                <p>
                  Details the company&apos;s primary activities and services, helping identify
                  industry-specific risks.
                </p>
              }
              props={{
                tooltipContent: {
                  align: 'center',
                },
              }}
            >
              <h4 className={'mb-4 font-semibold'}>LOB Description</h4>
            </ContentTooltip>
            <p
              className={ctw({
                'text-slate-400': !lineOfBusinessDescription,
              })}
            >
              {lineOfBusinessDescription || 'Not provided'}
            </p>
          </div>
          {mcc && mccDescription && (
            <div>
              <ContentTooltip
                description={
                  <p>
                    Categorizes the business by Merchant Category Code to ensure appropriate
                    classification and risk profiling per card brand regulations.
                  </p>
                }
                props={{
                  tooltipContent: {
                    align: 'center',
                  },
                }}
              >
                <h4 className={'mb-4 font-semibold'}>MCC Classification</h4>
              </ContentTooltip>
              <p>
                {mcc} - {mccDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {!!riskIndicators.length && (
        <Card>
          <div>
            <ContentTooltip
              description={<p>Checks the website for breaches of card brand regulations.</p>}
              props={{
                tooltipContent: {
                  align: 'center',
                },
              }}
            >
              <CardHeader className={'p-0 pb-4 pl-6 pt-6 text-lg font-bold'}>
                Content Violations Summary
              </CardHeader>
            </ContentTooltip>
          </div>
          <CardContent className={'flex flex-col space-y-4'}>
            <h4 className={'font-semibold'}>Findings</h4>
            {riskIndicators
              .filter(i => i.riskLevel !== 'positive')
              .map(riskIndicator => {
                const screenshotUrl = riskIndicator.screenshot?.screenshotUrl ?? null;

                return (
                  <Card key={riskIndicator.name}>
                    <CardContent className={'py-6'}>
                      <h4 className={'mb-2 text-lg font-semibold'}>{riskIndicator.name}</h4>

                      <div className={'flex items-start justify-between gap-8'}>
                        <div
                          className={ctw(
                            'flex w-3/4 justify-between gap-8 leading-6',
                            !screenshotUrl && 'w-full',
                          )}
                        >
                          <div className={'grow-0 basis-1/2'}>
                            <p className={'font-medium'}>Description</p>
                            <p>{riskIndicator.explanation}</p>
                          </div>

                          <div className={'grow-0 basis-1/2 space-y-2'}>
                            <div>
                              <p className={'font-medium'}>Why Our AI Flagged This?</p>
                              <p>{riskIndicator.reason}</p>
                            </div>

                            <div className={'leading-5'}>
                              <p className={'font-medium'}>Source</p>
                              <p className={'italic'}>
                                &quot;{riskIndicator.quoteFromSource}&quot;
                              </p>
                            </div>
                          </div>
                        </div>

                        {screenshotUrl !== null && (
                          <div className={'flex w-1/4 flex-col gap-y-2'}>
                            <a
                              href={screenshotUrl}
                              target={'_blank'}
                              rel={'noreferrer'}
                              title={'Click to view full screenshot'}
                              className={'relative w-full'}
                            >
                              <img
                                src={screenshotUrl}
                                alt={`${riskIndicator.name} screenshot of the website`}
                                className={'h-auto max-h-[400px] w-full object-cover object-top'}
                              />
                            </a>

                            {riskIndicator.sourceUrl && (
                              <a
                                href={riskIndicator.sourceUrl}
                                target={'_blank'}
                                rel={'noreferrer'}
                                className={'mt-2 block max-w-[20rem] truncate'}
                              >
                                {riskIndicator.sourceUrl}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
