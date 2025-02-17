import React, { FunctionComponent } from 'react';
import { Card, CardContent, CardHeader } from '@/components';
import { EcosystemTable } from '@/components/templates/report/components/Ecosystem/components/EcosystemTable/EcosystemTable';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { EcosystemRecordSchema } from '@ballerine/common';
import { z } from 'zod';

export const Ecosystem: FunctionComponent<{
  data: z.infer<typeof EcosystemRecordSchema>[];
}> = ({ data }) => {
  return (
    <div className={'space-y-8'}>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Ecosystem</CardHeader>
        <CardContent>
          <EcosystemTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};
