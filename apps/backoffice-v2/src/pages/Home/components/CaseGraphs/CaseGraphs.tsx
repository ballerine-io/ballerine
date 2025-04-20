import { Loader2 } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import type { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { useCaseDailyStats } from '@/domains/metrics/hooks/queries/useCaseDailyStats/useCaseDailyStats';

export const CaseGraphs: FunctionComponent<{
  from: ReturnType<typeof useHomeLogic>['mmFrom'];
  to: ReturnType<typeof useHomeLogic>['mmTo'];
}> = ({ from, to }) => {
  const { data: liveCasesData, isLoading } = useCaseDailyStats({ from, to });

  return (
    <div className="grid grid-cols-6">
      <div className={'col-span-4 min-h-[24rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'flex flex-row items-center justify-between pb-1 font-bold'}>
            Live Cases Per Day
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex h-72 w-full items-center justify-center">
                <Loader2 className="w-8 animate-spin" />
              </div>
            )}

            {!isLoading && liveCasesData && (
              <>
                <p className={'mb-4 text-slate-400'}>
                  Data shown from case opening date to closing date
                </p>

                {liveCasesData.length ? (
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
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        fillOpacity={0.85}
                      />
                    </BarChart>
                  </div>
                ) : (
                  <div className="flex h-72 w-full items-center justify-center text-slate-500">
                    No Data Available
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
