import React, { ComponentProps, FunctionComponent } from 'react';
import { RiskIndicator } from '@/components/molecules/RiskIndicator/RiskIndicator';
import { Card, CardContent, CardHeader } from '@/components/atoms';

export const RiskIndicatorsSummary: FunctionComponent<{
  riskIndicators: Array<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;
  Link: ComponentProps<typeof RiskIndicator>['Link'];
}> = ({ riskIndicators, Link }) => {
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
              Link={Link}
            />
          ))}
        {!riskIndicators?.length && <p>No risk indicators detected.</p>}
      </CardContent>
    </Card>
  );
};
