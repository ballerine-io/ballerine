import dayjs from 'dayjs';
import { InfoIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { capitalize } from 'string-ts';

import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import {
  CardDescription,
  CardFooter,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { ReportSchema, RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';

const engagementMetricsMapper = {
  'Time on site': {
    description: 'The average amount of time visitors spend on the website.',
    suffix: ' seconds',
    shouldRound: true,
  },
  'Page per visit': {
    description: 'The average number of pages viewed during a session.',
    suffix: ' pages',
    shouldRound: false,
  },
  'Bounce rate': {
    description:
      'How many visitors left the website without interacting further or navigating to another page.',
    suffix: '%',
    shouldRound: true,
  },
} as const;

const PIE_COLORS = ['#007aff', '#65afff', '#98cafe', '#cde4ff', '#f0f9ff'];

export const WebsiteCredibility: FunctionComponent<{
  websiteReputationRiskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  pricingRiskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  websiteStructureRiskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  trafficRiskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  trafficData: Pick<
    NonNullable<z.infer<typeof ReportSchema>['data']>,
    'trafficSources' | 'monthlyVisits' | 'pagesPerVisit' | 'timeOnSite' | 'bounceRate'
  >;
}> = ({
  websiteReputationRiskIndicators,
  pricingRiskIndicators,
  websiteStructureRiskIndicators,
  trafficData,
  trafficRiskIndicators,
}) => {
  // TODO: Ideally should happen on backend
  const trafficSources = useMemo(() => {
    if (!Object.keys(trafficData.trafficSources ?? {}).length) {
      return [];
    }

    const values = Object.entries(trafficData.trafficSources ?? {})
      .map(([label, value]) => ({
        label,
        value: Number((value * 100).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);

    const remainder = 100 - values.reduce((acc, item) => acc + item.value, 0);

    const existingOtherIdx = values.findIndex(({ label }) => label === 'other');

    if (existingOtherIdx > -1) {
      values[existingOtherIdx]!.value = Number(
        (values[existingOtherIdx]!.value + remainder).toFixed(2),
      );
    } else if (remainder > 0) {
      values.push({ label: 'other', value: Number(remainder.toFixed(2)) });
    }

    return values;
  }, [trafficData.trafficSources]);

  const engagements = (
    [
      {
        label: 'Time on site',
        value:
          typeof trafficData.timeOnSite === 'string'
            ? parseFloat(trafficData.timeOnSite).toFixed(2)
            : trafficData.timeOnSite,
      },
      {
        label: 'Page per visit',
        value:
          typeof trafficData.pagesPerVisit === 'string'
            ? parseFloat(trafficData.pagesPerVisit).toFixed(2)
            : trafficData.pagesPerVisit,
      },
      {
        label: 'Bounce rate',
        value:
          typeof trafficData.bounceRate === 'string'
            ? (parseFloat(trafficData.bounceRate) * 100).toFixed(2)
            : trafficData.bounceRate,
      },
    ] as const
  ).filter(({ value }) => typeof value === 'string');

  let minVisitors = 0;
  let maxVisitors = 0;

  Object.values(trafficData.monthlyVisits ?? {}).forEach(num => {
    if (num < minVisitors) {
      minVisitors = num;
    }

    if (num > maxVisitors) {
      maxVisitors = num;
    }
  });

  const visitorsTotalArea = maxVisitors - minVisitors;

  const calculateTrend = (data: Array<{ label: string; value: number }>) => {
    if (data.length < 2) {
      return { direction: 'No trend data', percentage: 0 };
    }

    const lastMonthValue = data[data.length - 1]?.value ?? 0;
    const previousMonthValue = data[data.length - 2]?.value ?? 0;
    const percentageChange = ((lastMonthValue - previousMonthValue) / previousMonthValue) * 100;
    const direction = lastMonthValue > previousMonthValue ? 'up' : 'down';

    return { direction, percentage: Math.abs(percentageChange) };
  };

  const trend = calculateTrend(
    Object.entries(trafficData.monthlyVisits ?? {}).map(([label, value]) => ({ label, value })),
  );

  const aggregatedRiskIndicators = [
    ...websiteReputationRiskIndicators,
    ...pricingRiskIndicators,
    ...websiteStructureRiskIndicators,
    ...trafficRiskIndicators,
  ];

  return (
    <div className="space-y-6">
      <RiskIndicators riskIndicators={aggregatedRiskIndicators} />
      <Card>
        <div>
          <ContentTooltip
            description={
              <p>
                Examines public perception and user feedback, flagging mentions of fraud or scams to
                highlight potential risks.
              </p>
            }
            props={{
              tooltipContent: {
                align: 'center',
              },
            }}
          >
            <CardHeader className="p-0 py-6 pl-6 font-bold">Online Reputation Analysis</CardHeader>
          </ContentTooltip>
        </div>

        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!websiteReputationRiskIndicators?.length,
            })}
          >
            {!!websiteReputationRiskIndicators?.length &&
              websiteReputationRiskIndicators.map(({ reason, sourceUrl }) => (
                <li key={reason} className="list-decimal">
                  {reason}
                  {!!sourceUrl && (
                    <span className="ms-4">
                      (<BallerineLink href={sourceUrl}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!websiteReputationRiskIndicators?.length && (
              <li>No indications of negative website reputation were detected.</li>
            )}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <ContentTooltip
          description={
            <p>
              Analyzes visitor volume and sources to gauge popularity and detect red flags in
              expected merchant behavior.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <CardHeader className="p-0 py-6 pl-6 font-bold">Traffic Analysis</CardHeader>
        </ContentTooltip>

        <CardContent className="flex h-auto w-full flex-col gap-4 px-4 pb-4 pt-0 2xl:!h-[30rem] 2xl:!flex-row">
          <Card className="flex h-[30rem] w-full flex-col 2xl:h-full 2xl:w-3/5">
            <CardHeader className="px-6 pb-2 pt-4 font-bold">
              Estimated Monthly Visitors
              <CardDescription className="text-muted-foreground text-sm font-normal">
                Showing total visitors for the last 6 months
              </CardDescription>
            </CardHeader>

            <CardContent className="relative h-full p-2">
              {Object.entries(trafficData.monthlyVisits ?? {}).length > 0 ? (
                <ChartContainer
                  className="h-[20rem] w-[95%] 2xl:w-full"
                  config={{
                    visitors: {
                      label: 'Visited',
                      color: '#007aff',
                    },
                  }}
                >
                  <AreaChart
                    accessibilityLayer
                    data={Object.entries(trafficData.monthlyVisits ?? {}).map(([month, value]) => ({
                      month,
                      visitors: value,
                    }))}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007aff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#007aff" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={value => dayjs(value).format('MMM YYYY')}
                    />
                    <YAxis
                      ticks={[
                        minVisitors,
                        Math.trunc(visitorsTotalArea / 4),
                        Math.trunc(visitorsTotalArea / 2),
                        Math.trunc((3 * visitorsTotalArea) / 4),
                        maxVisitors,
                      ]}
                      domain={[minVisitors - (maxVisitors * 1.2 - maxVisitors), maxVisitors * 1.2]}
                      tickFormatter={value =>
                        Intl.NumberFormat('en', { notation: 'compact' }).format(value)
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          valueRender={value => (
                            <span className="text-foreground ml-4 font-mono font-medium tabular-nums">
                              {Intl.NumberFormat('en').format(Number(value))}
                            </span>
                          )}
                        />
                      }
                    />
                    <Area
                      dataKey="visitors"
                      type="natural"
                      fill="url(#colorVisitors)"
                      fillOpacity={0.4}
                      stroke="#007aff"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p>No Monthly Visitors Data Available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    {trend.direction !== 'No trend data' && (
                      <>
                        {trend.direction === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span>{`Trending ${trend.direction} by ${trend.percentage.toFixed(
                          1,
                        )}% this month`}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="flex h-[15rem] w-full gap-4 2xl:h-full 2xl:w-2/5 2xl:flex-col">
            <Card className="h-full w-1/2 2xl:!h-1/2 2xl:!w-full">
              <CardHeader className="px-6 pb-2 pt-4 font-bold">Traffic Sources</CardHeader>

              <CardContent className="mt-auto h-4/5 w-full p-2">
                {trafficSources.length > 0 ? (
                  <ResponsiveContainer width="90%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={40}
                        outerRadius={60}
                        startAngle={90}
                        endAngle={450}
                        width="50%"
                        className="focus:outline-none"
                      >
                        {trafficSources.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ width: '50%', maxHeight: '100%' }}
                        content={({ payload }) => (
                          <div className="flex flex-col space-y-1 pr-4">
                            {payload?.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center space-x-2">
                                <span
                                  className="block h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                                  }}
                                />
                                <div className="flex w-full justify-between">
                                  <span className="text-gray-500">{capitalize(entry.value)}</span>
                                  <span className="font-semibold">{entry.payload?.value}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p>No Traffic Sources Data Available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="h-full w-1/2 2xl:!h-1/2 2xl:!w-full">
              <CardHeader className="px-6 pb-2 pt-4 font-bold">Engagement</CardHeader>

              <CardContent className="flex h-3/5 items-center gap-6 px-4 py-2">
                {engagements.length > 0 ? (
                  engagements
                    .filter(
                      (
                        obj,
                      ): obj is Readonly<{
                        value: string;
                        label: keyof typeof engagementMetricsMapper;
                      }> => typeof obj.value === 'string',
                    )
                    .map(({ label, value }) => {
                      const { suffix, description } = engagementMetricsMapper[label];

                      return (
                        <div key={label} className="basis-1/3">
                          <div className="flex flex-nowrap items-center gap-2">
                            <p className="whitespace-nowrap text-gray-500">{label}</p>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                  <InfoIcon className="h-4 w-4 text-gray-500" />
                                </TooltipTrigger>

                                <TooltipContent
                                  side="right"
                                  align="center"
                                  className="text-primary max-w-[12rem] border border-gray-400 bg-gray-50 text-sm"
                                >
                                  <p className="text-sm text-gray-500">{description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <p>
                            <span className="font-bold">{value}</span>
                            <span className={ctw(suffix === '%' && 'font-bold')}>{suffix}</span>
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p>No Engagement Data Available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div>
          <ContentTooltip
            description={
              <p>
                Evaluates the quality and layout of the website, identifying issues like missing
                legal pages such as terms and conditions.
              </p>
            }
            props={{
              tooltipContent: {
                align: 'center',
              },
            }}
          >
            <CardHeader className="p-0 py-6 pl-6 font-bold">
              Website Structure and Content Evaluation
            </CardHeader>
          </ContentTooltip>
        </div>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!websiteStructureRiskIndicators?.length,
            })}
          >
            {!!websiteStructureRiskIndicators?.length &&
              websiteStructureRiskIndicators.map(({ reason }) => (
                <li className="list-decimal">{reason}</li>
              ))}
            {!websiteStructureRiskIndicators?.length && (
              <li>No structural issues or missing compliance pages were detected.</li>
            )}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <div>
          <ContentTooltip
            description={
              <p>
                Analyzes webiste pricing strategies to detect anomalies, flagging deceptive
                practices and identifying potential scams or counterfeit goods.
              </p>
            }
            props={{
              tooltipContent: {
                align: 'center',
              },
            }}
          >
            <CardHeader className="p-0 py-6 pl-6 font-bold">Pricing Analysis</CardHeader>
          </ContentTooltip>
        </div>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!pricingRiskIndicators?.length,
            })}
          >
            {!!pricingRiskIndicators?.length &&
              pricingRiskIndicators.map(({ reason, sourceUrl }) => (
                <li key={reason} className="list-decimal">
                  {reason}
                  {!!sourceUrl && (
                    <span className={'ms-4'}>
                      (<BallerineLink href={sourceUrl}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!pricingRiskIndicators?.length && (
              <li>
                No indications of suspicious pricing or anomalies in the website’s pricing were
                detected.
              </li>
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
