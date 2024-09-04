import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { TrendingUp } from 'lucide-react';
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
import { HomeMetricsOutputSchema } from '@/domains/metrics/hooks/queries/useHomeMetricsQuery/useHomeMetricsQuery';
import {
  reportStatusToBackgroundColor,
  reportStatusToFillColor,
} from '@/pages/Statistics/components/PortfolioRiskStatistics/constants';

export const PortfolioRiskStatistics: FunctionComponent<
  z.infer<typeof HomeMetricsOutputSchema>
> = ({ riskIndicators, reportsRisks, reportStatuses, mccCounts }) => {
  const {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    filters,
    totalRiskIndicators,
    riskIndicatorsSorting,
    onSortRiskIndicators,
    filteredRiskIndicators,
  } = usePortfolioRiskStatisticsLogic({
    riskIndicators,
    reportsRisks,
    reportStatuses,
    mccCounts,
  });

  return (
    <div>
      <h5 className={'mb-4 font-bold'}>Portfolio Risk Statistics</h5>
      <div className={'grid grid-cols-3 gap-6'}>
        <div className={'grid grid-cols-2 gap-3'}>
          {filters?.map(filter => {
            const totalRisk = Object.values(filter.riskLevels).reduce((acc, curr) => acc + curr, 0);

            return (
              <div
                key={filter.name}
                className={'col-span-full min-h-[13.125rem] rounded-xl bg-[#F6F6F6] p-2'}
              >
                <Card className={'flex h-full flex-col px-3'}>
                  <CardHeader className={'pb-1'}>{filter.name}</CardHeader>
                  <CardContent>
                    <p className={'mb-8 text-slate-400'}>{filter.description}</p>
                    <div className={'flex items-center space-x-5 pt-3'}>
                      <PieChart width={104} height={104}>
                        <text
                          x={52}
                          y={44}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={ctw('font-bold', {
                            'text-sm': totalRisk?.toString().length >= 5,
                          })}
                        >
                          {totalRisk}
                        </text>
                        <text
                          x={52}
                          y={60}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={'text-xs'}
                        >
                          {filter.entityPlural}
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
          <div
            key={'Report Statuses'}
            className={'col-span-full min-h-[13.125rem] rounded-xl bg-[#F6F6F6] p-2'}
          >
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>Report Status</CardHeader>
              <CardContent>
                <p className={'mb-8 text-slate-400'}>Merchant monitoring statuses</p>
                <div className={'flex items-center space-x-5 pt-3'}>
                  <PieChart width={104} height={104}>
                    <text
                      x={52}
                      y={44}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={ctw('font-bold')}
                    >
                      {reportStatuses.reduce((acc, curr) => acc + curr.count, 0)}
                    </text>
                    <text
                      x={52}
                      y={60}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={'text-xs'}
                    >
                      {'Reports'}
                    </text>
                    <Pie
                      data={reportStatuses.map(({ status, count }) => ({
                        name: titleCase(status),
                        count,
                      }))}
                      cx={47}
                      cy={47}
                      innerRadius={43}
                      outerRadius={52}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="count"
                      cornerRadius={9999}
                    >
                      {reportStatuses.map(({ status }) => (
                        <Cell
                          key={status}
                          className={ctw(
                            reportStatusToFillColor[status as keyof typeof reportStatusToFillColor],
                            'outline-none',
                          )}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <ul className={'w-full max-w-sm'}>
                    {reportStatuses.map(({ status, count }) => {
                      return (
                        <li key={status} className={'flex items-center space-x-4  text-xs'}>
                          <span
                            className={ctw(
                              'flex h-2 w-2 rounded-full',
                              reportStatusToBackgroundColor[
                                status as keyof typeof reportStatusToBackgroundColor
                              ],
                            )}
                          />
                          <div className={'flex w-full justify-between'}>
                            <span className={'text-slate-500'}>{titleCase(status)}</span>
                            {count}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>MCCs Detected</CardHeader>
            <CardContent>
              <div className={'mb-7 flex items-end space-x-2'}>
                <span className={'text-3xl font-semibold'}>
                  {Intl.NumberFormat().format(mccCounts.reduce((acc, curr) => acc + curr.count, 0))}
                </span>
                <span className={'text-sm leading-7 text-slate-500'}>Total MCCs Detected</span>
              </div>
              <div className={'mb-6'}>
                <Button
                  variant={'ghost'}
                  className={ctw(
                    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',
                    {
                      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':
                        riskIndicatorsSorting === 'desc',
                    },
                  )}
                  onClick={onSortRiskIndicators('desc')}
                >
                  <TrendingUp />
                  Most Common
                </Button>
              </div>
              <Table>
                <TableHeader className={'[&_tr]:border-b-0'}>
                  <TableRow className={'hover:bg-[unset]'}>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>MCCs</TableHead>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody ref={parent}>
                  {mccCounts.slice(0, 8).map(({ mccDescription, mcc, count }, index) => (
                    <TableRow key={mccDescription} className={'border-b-0 hover:bg-[unset]'}>
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
                            {`${mcc} - ${mccDescription}`}
                          </div>
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
        <div className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Risk Indicators</CardHeader>
            <CardContent>
              <div className={'mb-7 flex items-end space-x-2'}>
                <span className={'text-3xl font-semibold'}>
                  {Intl.NumberFormat().format(totalRiskIndicators)}
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
                        riskIndicatorsSorting === 'desc',
                    },
                  )}
                  onClick={onSortRiskIndicators('desc')}
                >
                  <TrendingUp />
                  Highest First
                </Button>
                {/*<Button*/}
                {/*  variant={'ghost'}*/}
                {/*  className={ctw(*/}
                {/*    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',*/}
                {/*    {*/}
                {/*      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':*/}
                {/*        riskIndicatorsSorting === 'asc',*/}
                {/*    },*/}
                {/*  )}*/}
                {/*  onClick={onSortRiskIndicators('asc')}*/}
                {/*>*/}
                {/*  <TrendingDown />*/}
                {/*  Lowest First*/}
                {/*</Button>*/}
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
                  {filteredRiskIndicators.map(({ name, count }, index) => (
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
