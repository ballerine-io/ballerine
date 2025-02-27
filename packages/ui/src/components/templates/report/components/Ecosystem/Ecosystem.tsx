import { FunctionComponent } from 'react';
import { z } from 'zod';

import { Card, CardContent, CardHeader } from '@/components';
import { EcosystemTable } from '@/components/templates/report/components/Ecosystem/components/EcosystemTable/EcosystemTable';
import { EcosystemRecordSchema } from '@ballerine/common';

export const Ecosystem: FunctionComponent<{
  data: Array<z.infer<typeof EcosystemRecordSchema>>;
}> = ({ data }) => {
  return (
    <div className={'space-y-6'}>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Ecosystem Analysis</CardHeader>
        <CardContent>
          <EcosystemTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};
