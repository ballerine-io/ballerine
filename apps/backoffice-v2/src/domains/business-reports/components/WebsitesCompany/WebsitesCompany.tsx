import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { BallerineLink } from '@/common/components/atoms/BallerineLink/BallerineLink';

export const WebsitesCompany: FunctionComponent<{
  companyReputationAnalysis: Array<{
    label: string;
    url: string;
  }>;
  violations: Array<{
    label: string;
    severity: string;
  }>;
}> = ({ companyReputationAnalysis, violations }) => {
  return (
    <div className={'space-y-8'}>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Company Reputation Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!companyReputationAnalysis?.length,
            })}
          >
            {!!companyReputationAnalysis?.length &&
              companyReputationAnalysis.map(({ label, url }) => (
                <li key={label} className={'list-decimal'}>
                  {label}
                  {!!url && (
                    <span className={'ms-4'}>
                      (<BallerineLink href={url}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!companyReputationAnalysis?.length && <li>No reputation analysis found.</li>}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
