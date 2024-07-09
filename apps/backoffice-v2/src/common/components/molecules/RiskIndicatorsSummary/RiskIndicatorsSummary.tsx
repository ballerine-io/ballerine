import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { RiskIndicator } from '@/common/components/molecules/RiskIndicator/RiskIndicator';

export const RiskIndicatorsSummary: FunctionComponent<{
  riskIndicators: Array<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;
}> = ({ riskIndicators }) => {
  return (
    <Card className={'col-span-full'}>
      <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
      <CardContent className={'grid grid-cols-2 gap-4 xl:grid-cols-3'}>
        {!!riskIndicators?.length &&
          riskIndicators?.map(riskIndicator => (
            <RiskIndicator
              key={riskIndicator.title}
              title={riskIndicator.title}
              search={riskIndicator.search}
              violations={riskIndicator.violations}
            />
          ))}
        {!riskIndicators?.length && <p>No risk indicators detected.</p>}
      </CardContent>
    </Card>
  );
};
