import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { EcosystemAndTransactionsTable } from '@/domains/business-reports/components/EcosystemAndTransactions/components/EcosystemAndTransactionsTable/EcosystemAndTransactionsTable';
import { columns } from '@/domains/business-reports/components/EcosystemAndTransactions/components/EcosystemAndTransactionsTable/columns';

export const EcosystemAndTransactions: FunctionComponent<{
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
      <h3 className={'col-span-full text-lg font-bold'}>Ecosystem and Transactions Analysis</h3>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Ecosystem</CardHeader>
        <CardContent>
          <EcosystemAndTransactionsTable columns={columns} data={matches} />
        </CardContent>
      </Card>
    </div>
  );
};
