import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { EcosystemTable } from '@/domains/business-reports/components/Ecosystem/components/EcosystemTable/EcosystemTable';
import { columns } from '@/domains/business-reports/components/Ecosystem/components/EcosystemTable/columns';

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
          <EcosystemTable columns={columns} data={matches} />
        </CardContent>
      </Card>
    </div>
  );
};
