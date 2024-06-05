import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

export const WebsiteLineOfBusiness: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  summary: string;
}> = ({ violations, summary }) => {
  return (
    <div className={'space-y-8'}>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Line of Business Summary</CardHeader>
        <CardContent className={'flex flex-col space-y-4'}>
          <div>
            <h4 className={'mb-4 font-semibold'}>LOB Description</h4>
            <p>{summary}</p>
          </div>
        </CardContent>
      </Card>
      {/*<Card>*/}
      {/*  <CardHeader className={'pt-4 font-bold'}>Content Violations Summary</CardHeader>*/}
      {/*  <CardContent className={'flex flex-col space-y-4'}>*/}
      {/*    <div>*/}
      {/*      <h4 className={'mb-4 font-semibold'}>Findings</h4>*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
    </div>
  );
};