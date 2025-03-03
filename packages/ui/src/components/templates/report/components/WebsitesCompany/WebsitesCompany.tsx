import { RiskIndicatorSchema } from '@ballerine/common';
import { FunctionComponent } from 'react';
import { z } from 'zod';

import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';

export const WebsitesCompany: FunctionComponent<{
  riskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
}> = ({ riskIndicators }) => {
  return (
    <div className={'space-y-6'}>
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
              riskIndicators.map(({ reason, sourceUrl }) => (
                <li key={reason} className={'list-decimal'}>
                  {reason}
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
