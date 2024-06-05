import React, { FunctionComponent } from 'react';
import { RiskIndicators } from '@/common/components/molecules/RiskIndicators/RiskIndicators';

export const WebsiteCredibility: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  onlineReputationAnalysis: string;
}> = ({ violations, onlineReputationAnalysis }) => {
  return (
    <div className={'space-y-8'}>
      <RiskIndicators violations={violations} />
      {/*<Card>*/}
      {/*  <CardHeader className={'pt-4 font-bold'}>Online Reputation Analysis</CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <h4>What&apos;s in this check?</h4>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card>*/}
      {/*  <CardHeader className={'pt-4 font-bold'}>Pricing Analysis</CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <h4>What&apos;s in this check?</h4>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card>*/}
      {/*  <CardHeader className={'pt-4 font-bold'}>*/}
      {/*    Website Structure and Content Evaluation*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <h4>What&apos;s in this check?</h4>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card>*/}
      {/*  <CardHeader className={'pt-4 font-bold'}>Traffic Analysis</CardHeader>*/}
      {/*  <CardContent></CardContent>*/}
      {/*</Card>*/}
    </div>
  );
};
