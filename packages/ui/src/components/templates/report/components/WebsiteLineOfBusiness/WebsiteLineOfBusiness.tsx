import React, { FunctionComponent } from 'react';
import { ctw } from '@/common';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { Card, CardContent, CardHeader } from '@/components';

export const WebsiteLineOfBusiness: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  description: string;
}> = ({ violations, description }) => {
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
      </Card>
    </div>
  );
};
