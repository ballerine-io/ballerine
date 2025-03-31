import { FunctionComponent } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { z } from 'zod';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';

export const CaseGraphs: FunctionComponent<
  Pick<z.infer<typeof MetricsResponseSchema>, 'riskLevelCounts' | 'violationCounts'> & {
    userSelectedDate: Date;
  }
> = ({ riskLevelCounts, violationCounts, userSelectedDate }) => {
  // const {
  //   riskLevelToFillColor,
  //   parent,
  //   widths,
  //   riskLevelToBackgroundColor,
  //   filteredRiskIndicators,
  //   locale,
  //   navigate,
  //   alertedReports,
  //   from,
  //   to,
  //   isMerchantMonitoringEnabled,
  // } = useCaseGraphsLogic({ userSelectedDate, violationCounts });

  // Mock data for live cases per day
  const liveCasesData = [
    { date: '01/08', cases: 12 },
    { date: '02/08', cases: 19 },
    { date: '03/08', cases: 15 },
    { date: '04/08', cases: 22 },
    { date: '05/08', cases: 28 },
    { date: '06/08', cases: 23 },
    { date: '07/08', cases: 17 },
    { date: '08/08', cases: 20 },
    { date: '09/08', cases: 25 },
    { date: '10/08', cases: 30 },
  ];

  return (
    <div>
      <h3 className={'mb-4 text-xl font-bold'}>Portfolio Risk Statistics</h3>
      <div className={'mb-6 grid grid-cols-1 gap-6'}>
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1 font-bold'}>Amount Of Live Cases Per Day</CardHeader>
            <CardContent>
              <p className={'mb-4 text-slate-400'}>
                Data shown from case opening date to closing date
              </p>
              <div className={'flex h-72 w-full justify-center'}>
                <BarChart
                  width={800}
                  height={300}
                  data={liveCasesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                  barSize={35}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    padding={{ left: 10, right: 10 }}
                    label={{
                      value: 'Date',
                      position: 'insideBottom',
                      offset: -15,
                      fill: '#4B5563',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    label={{
                      value: 'Cases',
                      angle: -90,
                      position: 'insideLeft',
                      offset: -5,
                      fill: '#4B5563',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{
                      borderRadius: '6px',
                      border: 'none',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Bar
                    dataKey="cases"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    fillOpacity={0.85}
                  />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
