import { buttonVariants, WarningFilledSvg } from '@ballerine/ui';
import qs from 'qs';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart } from 'recharts';
import { titleCase } from 'string-ts';
import { z } from 'zod';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import type { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { ctw } from '@/common/utils/ctw/ctw';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';
import { usePortfolioRiskStatisticsLogic } from './hooks/usePortfolioRiskStatisticsLogic/usePortfolioRiskStatisticsLogic';

export const PortfolioRiskStatistics: FunctionComponent<
  Pick<z.infer<typeof MetricsResponseSchema>, 'riskLevelCounts' | 'violationCounts'> & {
    from: ReturnType<typeof useHomeLogic>['mmFrom'];
    to: ReturnType<typeof useHomeLogic>['mmTo'];
  }
> = ({ from, to, riskLevelCounts, violationCounts }) => {
  const {
    riskLevelToFillColor,
    parent,
    widths,
    riskLevelToBackgroundColor,
    filteredRiskIndicators,
    locale,
    navigate,
    alertedReports,
    isOngoingMonitoringEnabled,
  } = usePortfolioRiskStatisticsLogic({ from, to, violationCounts });

  return (
    <div className={'grid grid-cols-3 gap-6'}>
      <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'pb-1 font-bold'}>Merchant Monitoring Risk</CardHeader>
          <CardContent>
            <p className={'mb-8'}>Risk levels of all merchant monitoring reports.</p>
            <div className={'flex flex-col items-center space-y-4 pt-3'}>
              <PieChart width={184} height={184}>
                <text
                  x={92}
                  y={82}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={'text-lg font-bold'}
                >
                  {Object.values(riskLevelCounts).reduce((acc, curr) => acc + curr, 0)}
                </text>
                <text x={92} y={102} textAnchor="middle" dominantBaseline="middle">
                  Reports
                </text>
                <Pie
                  data={Object.entries(riskLevelCounts).map(([riskLevel, value]) => ({
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
                        'cursor-pointer outline-none',
                      )}
                      onClick={() => {
                        navigate(
                          `/${locale}/merchant-monitoring?${qs.stringify({
                            allowAllDates: !from && !to,
                            'riskLevels[0]': riskLevel,
                            from: from ?? undefined,
                            to: to ?? undefined,
                          })}`,
                        );
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
              <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                {Object.entries(riskLevelCounts)
                  .reverse()
                  .map(([riskLevel, value]) => (
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
      <div className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'pb-2 font-bold'}>Top 10 Content Violations</CardHeader>
          <CardContent>
            {filteredRiskIndicators.length ? (
              <Table>
                <TableHeader className={'[&_tr]:border-b-0'}>
                  <TableRow className={'hover:bg-[unset]'}>
                    <TableHead className={'h-0 ps-0 text-foreground'}>Indicator</TableHead>
                    <TableHead className={'h-0 px-0 text-foreground'}>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody ref={parent}>
                  {filteredRiskIndicators.map(({ name, count, id }, index) => (
                    <TableRow key={name} className={'border-b-0 hover:bg-[unset]'}>
                      <TableCell className={ctw('pb-0 ps-0', index !== 0 && 'pt-2')}>
                        <Link
                          to={`/${locale}/merchant-monitoring?${qs.stringify({
                            allowAllDates: !from && !to,
                            'findings[0]': id,
                            from: from ?? undefined,
                            to: to ?? undefined,
                          })}`}
                          className={`block h-full cursor-pointer rounded bg-blue-200 p-1 transition-all`}
                          style={{ width: `${widths[index]}%` }}
                        >
                          {titleCase(name ?? '')}
                        </Link>
                      </TableCell>
                      <TableCell className={'!px-0 pb-0'}>
                        {Intl.NumberFormat().format(count)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className={'flex h-72 w-full items-center justify-center text-slate-500'}>
                No Data Available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {isOngoingMonitoringEnabled && (
        <div className={'self-start rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-2 font-bold'}>Unresolved Monitoring Alerts</CardHeader>
            <CardContent>
              <div className={'flex justify-between'}>
                <div className={'flex items-center space-x-1'}>
                  <WarningFilledSvg className={'mt-1 d-10'} />
                  <span className={'text-3xl font-semibold'}>
                    {Intl.NumberFormat().format(alertedReports)}
                  </span>
                </div>
                <Link
                  to={`/${locale}/merchant-monitoring?${qs.stringify({
                    allowAllDates: !from && !to,
                    isAlert: 'Alerted',
                    from: from ?? undefined,
                    to: to ?? undefined,
                  })}`}
                  className={ctw(
                    buttonVariants({
                      variant: 'link',
                    }),
                    'h-[unset] cursor-pointer !p-0 !text-blue-500',
                  )}
                >
                  View
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
