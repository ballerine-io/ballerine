import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { titleCase } from 'string-ts';
import { usePortfolioRiskStatisticsLogic } from '@/pages/Statistics/components/PortfolioRiskStatistics/hooks/usePortfolioRiskStatisticsLogic/usePortfolioRiskStatisticsLogic';
import { z } from 'zod';
import { StatisticsOutputSchema } from '@/pages/Statistics/statistics.query';
import { SortDirection } from '@ballerine/common';

export const PortfolioRiskStatistics: FunctionComponent<{
  data: z.infer<typeof StatisticsOutputSchema>;
  violationsSorting: SortDirection;
  setViolationsSorting: React.Dispatch<React.SetStateAction<SortDirection>>;
}> = ({ data, violationsSorting, setViolationsSorting }) => {
  const {
    portfolio,
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    filters,
    totalIndicators,
    onSort,
  } = usePortfolioRiskStatisticsLogic({
    setSorting: setViolationsSorting,
    data,
  });

  return (
    <div>
      <h5 className={'mb-4 font-bold'}>Portfolio Risk Statistics</h5>
      <div className={'grid grid-cols-3 gap-6'}>
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Portfolio Risk</CardHeader>
            <CardContent>
              <div className={'flex flex-col items-center space-y-4 pt-3'}>
                <PieChart width={184} height={184}>
                  <text
                    x={92}
                    y={92}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={'text-lg font-bold'}
                  >
                    103
                  </text>
                  <Pie
                    data={Object.entries(portfolio?.riskLevels ?? {}).map(([riskLevel, value]) => ({
                      name: `${titleCase(riskLevel)} Risk`,
                      value,
                    }))}
                    cx={87}
                    cy={87}
                    innerRadius={78}
                    outerRadius={92}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={9999}
                  >
                    {Object.keys(riskLevelToFillColor).map(riskLevel => (
                      <Cell
                        key={riskLevel}
                        className={ctw(
                          riskLevelToFillColor[riskLevel as keyof typeof riskLevelToFillColor],
                          'outline-none',
                        )}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                  {Object.entries(portfolio?.riskLevels).map(([riskLevel, value]) => (
                    <li
                      key={riskLevel}
                      className={'flex items-center space-x-4 border-b py-1 text-xs'}
                    >
                      <span
                        className={ctw(
                          'flex h-2 w-2 rounded-full',
                          riskLevelToBackgroundColor[
                            riskLevel as keyof typeof riskLevelToBackgroundColor
                          ],
                        )}
                      />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>{titleCase(riskLevel)} Risk</span>
                        <span>{value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
          {filters?.map(filter => {
            const totalRisk = Object.values(filter?.riskLevels ?? {}).reduce(
              (acc, curr) => acc + curr,
              0,
            );

            return (
              <div
                key={filter.name}
                className={'col-span-full min-h-[13.125rem] rounded-xl bg-[#F6F6F6] p-2'}
              >
                <Card className={'flex h-full flex-col px-3'}>
                  <CardHeader className={'pb-1'}>{filter.name} Risk</CardHeader>
                  <CardContent>
                    <div className={'flex items-center space-x-5 pt-3'}>
                      <PieChart width={104} height={104}>
                        <text
                          x={52}
                          y={52}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={ctw('font-bold', {
                            'text-sm': totalRisk?.toString().length >= 5,
                          })}
                        >
                          {totalRisk}
                        </text>
                        <Pie
                          data={Object.entries(filter?.riskLevels ?? {}).map(
                            ([riskLevel, value]) => ({
                              name: `${titleCase(riskLevel)} Risk`,
                              value,
                            }),
                          )}
                          cx={47}
                          cy={47}
                          innerRadius={43}
                          outerRadius={52}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          cornerRadius={9999}
                        >
                          {Object.keys(riskLevelToFillColor).map(riskLevel => (
                            <Cell
                              key={riskLevel}
                              className={ctw(
                                riskLevelToFillColor[
                                  riskLevel as keyof typeof riskLevelToFillColor
                                ],
                                'outline-none',
                              )}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                      <ul className={'w-full max-w-sm'}>
                        {Object.entries(filter?.riskLevels ?? {}).map(([riskLevel, value]) => {
                          return (
                            <li key={riskLevel} className={'flex items-center space-x-4  text-xs'}>
                              <span
                                className={ctw(
                                  'flex h-2 w-2 rounded-full',
                                  riskLevelToBackgroundColor[
                                    riskLevel as keyof typeof riskLevelToBackgroundColor
                                  ],
                                )}
                              />
                              <div className={'flex w-full justify-between'}>
                                <span className={'text-slate-500'}>
                                  {titleCase(riskLevel)} Risk
                                </span>
                                {value}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        <div className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Risk Indicators</CardHeader>
            <CardContent>
              <div className={'mb-7 flex items-end space-x-2'}>
                <span className={'text-3xl font-semibold'}>
                  {Intl.NumberFormat().format(totalIndicators)}
                </span>
                <span className={'text-sm leading-7 text-slate-500'}>Total indicators</span>
              </div>
              <div className={'mb-6'}>
                <Button
                  variant={'ghost'}
                  className={ctw(
                    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',
                    {
                      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':
                        violationsSorting === 'desc',
                    },
                  )}
                  onClick={onSort('desc')}
                >
                  <TrendingUp />
                  Highest First
                </Button>
                <Button
                  variant={'ghost'}
                  className={ctw(
                    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',
                    {
                      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':
                        violationsSorting === 'asc',
                    },
                  )}
                  onClick={onSort('asc')}
                >
                  <TrendingDown />
                  Lowest First
                </Button>
              </div>
              <Table>
                <TableHeader className={'[&_tr]:border-b-0'}>
                  <TableRow className={'hover:bg-[unset]'}>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>
                      Indicator
                    </TableHead>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody ref={parent}>
                  {data.violations.map(({ name, count }, index) => (
                    <TableRow key={name} className={'border-b-0 hover:bg-[unset]'}>
                      <TableCell
                        className={ctw('pb-0 ps-0', {
                          'pt-2': index !== 0,
                        })}
                      >
                        <div className={'h-full'}>
                          <div
                            className={`rounded bg-blue-200 p-1 transition-all`}
                            style={{
                              width: `${widths[index]}%`,
                            }}
                          >
                            {titleCase(name ?? '')}
                          </div>
                          {/*<span className={'relative z-50 ms-4'}>{titleCase(name ?? '')}</span>*/}
                        </div>
                      </TableCell>
                      <TableCell className={'pb-0 ps-0'}>
                        {Intl.NumberFormat().format(count)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
