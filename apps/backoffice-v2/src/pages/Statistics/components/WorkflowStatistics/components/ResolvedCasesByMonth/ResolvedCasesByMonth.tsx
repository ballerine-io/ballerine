import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomLegend } from '@/pages/Statistics/components/WorkflowStatistics/components/CustomLegend/CustomLegend';

export const ResolvedCasesByMonth: FunctionComponent<{
  resolvedCasesByMonth: Array<{
    month: string;
    category1: number;
  }>;
}> = ({ resolvedCasesByMonth }) => {
  return (
    <div className={'col-span-2 min-h-[26.875rem] rounded-xl bg-[#F6F6F6] p-2'}>
      <Card className={'flex h-full flex-col px-3'}>
        <CardHeader className={'pb-1'}>Resolved Cases by Month</CardHeader>
        <CardContent>
          <p className={'mb-8 text-slate-400'}>
            The IUCN Red List has assessed only a small share of the total known species in the
            world.
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={resolvedCasesByMonth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={46}
            >
              <CartesianGrid vertical={false} strokeDasharray="0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" align={'right'} content={<CustomLegend />} />
              <Bar dataKey="category1" fill="rgb(0, 122, 255)" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
