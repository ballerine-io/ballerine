import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';

export const WebsitesCompany: FunctionComponent<{
  companyReputationAnalysis: string[];
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
              companyReputationAnalysis.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!companyReputationAnalysis?.length && <li>No reputation analysis found.</li>}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
