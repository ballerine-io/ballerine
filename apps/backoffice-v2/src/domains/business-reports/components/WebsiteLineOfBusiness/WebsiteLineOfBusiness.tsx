import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';

export const WebsiteLineOfBusiness: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  description: string;
  detectedMcc: string | null;
}> = ({ violations, description, detectedMcc }) => {
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
    </div>
  );
};
