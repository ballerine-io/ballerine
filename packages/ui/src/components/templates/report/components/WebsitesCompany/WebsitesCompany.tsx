import React, { FunctionComponent } from 'react';
import { ctw, getUniqueRiskIndicators } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';

export const WebsitesCompany: FunctionComponent<{
  companyName: string;
  riskIndicators: z.infer<typeof RiskIndicatorSchema>[];
}> = ({ companyName, riskIndicators }) => {
  return (
    <div className={'space-y-8'}>
      <div>
        <ContentTooltip
          description={
            <p>
              Evaluates the company&apos;s reputation using customer feedback, reviews, and media
              coverage. Identifies trust issues and potential red flags.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className={'text-lg font-bold'}>
            Website&apos;s Company Analysis
            {companyName && companyName !== `N/A` && ` - ${companyName}`}
          </h3>
        </ContentTooltip>
      </div>

      <RiskIndicators riskIndicators={riskIndicators} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Company Reputation Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!riskIndicators?.length,
            })}
          >
            {!!riskIndicators?.length &&
              riskIndicators.map(({ description, sourceUrl }) => (
                <li className={'list-decimal'}>
                  {description}
                  {!!sourceUrl && (
                    <span className={'ms-4'}>
                      (<BallerineLink href={sourceUrl}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!riskIndicators?.length && (
              <li>No indications of negative company reputation were detected.</li>
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
