import { Card, CardContent, CardHeader } from '@/components/atoms';
import { RiskIndicator } from '@/components/molecules/RiskIndicator/RiskIndicator';
import { RiskIndicatorSchema, safeEvery } from '@ballerine/common';
import { ComponentProps, FunctionComponent } from 'react';
import { z } from 'zod';

export const RiskIndicatorsSummary: FunctionComponent<{
  sections: ReadonlyArray<{
    title: string;
    search?: string;
    indicators: Array<z.infer<typeof RiskIndicatorSchema>> | null;
  }>;
  Link?: ComponentProps<typeof RiskIndicator>['Link'];
}> = ({ sections = [], Link }) => {
  return (
    <Card className={'col-span-full'}>
      <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
      <CardContent className={'grid grid-cols-2 gap-4 xl:grid-cols-3'}>
        {sections.map(section => (
          <RiskIndicator
            key={section.title}
            title={section.title}
            search={section.search}
            riskIndicators={section.indicators}
            Link={Link}
          />
        ))}
        {!sections.length && <p>No risk indicators detected.</p>}
      </CardContent>
    </Card>
  );
};
