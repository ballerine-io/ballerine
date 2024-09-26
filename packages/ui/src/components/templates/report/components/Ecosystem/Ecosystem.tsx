import React, { FunctionComponent } from 'react';
import { Card, CardContent, CardHeader } from '@/components';
import { EcosystemTable } from '@/components/templates/report/components/Ecosystem/components/EcosystemTable/EcosystemTable';

export const Ecosystem: FunctionComponent<{
  violations: Array<{
    label: string;
    severity: string;
  }>;
  matches: Array<{
    matchedName: string;
    relatedNodeType: string;
    relatedNode: string;
    indicators: {
      label: string;
      severity: string;
    };
  }>;
}> = ({ violations, matches }) => {
  return (
    <div className={'space-y-8'}>
      <h3 className={'col-span-full text-lg font-bold'}>Ecosystem Analysis</h3>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Ecosystem</CardHeader>
        <CardContent>
          <EcosystemTable data={matches} />
        </CardContent>
      </Card>
    </div>
  );
};
