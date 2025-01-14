import { Card, CardContent, CardHeader } from '@/components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { ctw } from '@/common';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import dayjs from 'dayjs';
import { InfoIcon, TrendingDown } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { capitalize } from 'string-ts';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart } from 'recharts';
import { CardDescription, CardFooter } from '@/components/atoms';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/atoms';

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
  violations: Array<{
    label: string;
    severity: string;
  }>;
  onlineReputationAnalysis: Array<{ label: string; url: string }>;
  pricingAnalysis: string[];
  websiteStructureAndContentEvaluation: string[];
  trafficAnalysis: Record<
    'trafficSources' | 'montlyVisitsIndicators' | 'engagements',
    Array<{
      label: string;
      value: string;
    }>
  >;
}> = ({
  violations,
  onlineReputationAnalysis,
  pricingAnalysis,
  websiteStructureAndContentEvaluation,
  trafficAnalysis,
}) => {
  // TODO: Ideally should happen on backend
  const trafficSources = useMemo(() => {
    if (!trafficAnalysis?.trafficSources?.length) return [];

    return trafficAnalysis.trafficSources
      .map(({ label, value }) => ({ label, value: parseFloat(value) }))
      .concat({
        label: 'Other',
        value:
          100 -
          trafficAnalysis.trafficSources.reduce((acc, item) => acc + parseFloat(item.value), 0),
      })
      .map(({ label, value }) => ({ label, value: parseFloat(value.toFixed(2)) }));
  }, [trafficAnalysis.trafficSources]);

  const calculateTrend = (data: Array<{ label: string; value: string }>) => {
    if (data.length < 2) {
      return { direction: 'No trend data', percentage: 0 };
    }

    const lastMonthValue = parseInt(data[data.length - 1]?.value ?? '0');
    const previousMonthValue = parseInt(data[data.length - 2]?.value ?? '0');
    const percentageChange = ((lastMonthValue - previousMonthValue) / previousMonthValue) * 100;
    const direction = lastMonthValue > previousMonthValue ? 'up' : 'down';

    return { direction, percentage: Math.abs(percentageChange) };
  };

  const trend = calculateTrend(
    trafficAnalysis.montlyVisitsIndicators.map(({ label, value }) => ({ label, value })),
  );

  return (
    <div className="space-y-8">
      <div>
        <ContentTooltip
          description={
            <p>
              Evaluates the trustworthiness of the website, based on various factors, including its
              security measures, design, and user feedback.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className="col-span-full text-lg font-bold">Website Credibility Analysis</h3>
        </ContentTooltip>
      </div>
      <RiskIndicators violations={violations} />
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
              'ps-4': !!onlineReputationAnalysis?.length,
            })}
          >
            {!!onlineReputationAnalysis?.length &&
              onlineReputationAnalysis.map(({ label, url }) => (
                <li key={label} className="list-decimal">
                  {label}
                  {!!url && (
                    <span className="ms-4">
                      (<BallerineLink href={url}>source</BallerineLink>)
                    </span>
                  )}
                </li>
              ))}
            {!onlineReputationAnalysis?.length && (
              <li>No indications of negative website reputation were detected.</li>
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
              'ps-4': !!pricingAnalysis?.length,
            })}
          >
            {!!pricingAnalysis?.length &&
              pricingAnalysis.map(warning => (
                <li key={warning} className="list-decimal">
                  {warning}
                </li>
              ))}
            {!pricingAnalysis?.length && (
              <li>
                No indications of suspicious pricing or anomalies in the website’s pricing were
                detected.
              </li>
            )}
          </ol>
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
              'ps-4': !!websiteStructureAndContentEvaluation?.length,
            })}
          >
            {!!websiteStructureAndContentEvaluation?.length &&
              websiteStructureAndContentEvaluation.map(warning => (
                <li key={warning} className="list-decimal">
                  {warning}
                </li>
              ))}
            {!websiteStructureAndContentEvaluation?.length && (
              <li>No structural issues or missing compliance pages were detected.</li>
            )}
          </ol>
        </CardContent>
      </Card>
      <div>
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
          <h3 className="font-bold">Traffic Analysis</h3>
        </ContentTooltip>
      </div>
      <div className="flex h-[30rem] w-full gap-4">
        <Card className="flex h-full w-3/5 flex-col">
          <CardHeader className="p-4 font-bold">
            Estimated Monthly Visitors
            <CardDescription className="font-normal">
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto h-4/5 w-full pb-0">
            {trafficAnalysis.montlyVisitsIndicators.length > 0 ? (
              <ChartContainer
                className="h-[20rem] w-full"
                config={{
                  desktop: {
                    label: 'Monthly Visitors',
                    color: '#007aff',
                  },
                }}
              >
                <AreaChart
                  accessibilityLayer
                  data={trafficAnalysis.montlyVisitsIndicators.map(item => ({
                    month: item.label,
                    visitors: item.value,
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
                    tickFormatter={value => dayjs(value, 'MMMM YYYY').format('MMM YYYY')}
                  />
                  <YAxis
                    domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.2)]}
                    tickFormatter={value =>
                      Intl.NumberFormat('en', { notation: 'compact' }).format(value)
                    }
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md border border-gray-400 bg-white px-4 py-2 text-gray-600">
                            <p className="max-w-xs">{`On ${label} the company's website had approx. ${Intl.NumberFormat(
                              'en',
                            ).format(parseInt(String(payload.at(0)?.value)))} visitors`}</p>
                          </div>
                        );
                      }

                      return null;
                    }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
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
        <div className="flex h-full w-2/5 flex-col gap-4">
          <Card className="h-1/2 w-full">
            <CardHeader className="pb-0 pt-4 font-bold">Traffic Sources</CardHeader>
            <CardContent className="mt-auto h-full w-full pb-0">
              {trafficSources.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      dataKey="value"
                      nameKey="label"
                      cx="40%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={450}
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
                      wrapperStyle={{ width: '55%', maxHeight: '100%' }}
                      content={({ payload }) => (
                        <div className="flex flex-col space-y-1 pr-4">
                          {payload?.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center space-x-2">
                              <span
                                className="block h-2 w-2 rounded-full"
                                style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
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
          <Card className="h-1/2 w-full">
            <CardHeader className="pt-4 font-bold">Engagement</CardHeader>

            <CardContent className="flex h-3/5 items-center gap-6">
              {trafficAnalysis.engagements.length > 0 ? (
                trafficAnalysis?.engagements.map(({ label, value }) => {
                  const { suffix, description, shouldRound } =
                    engagementMetricsMapper[label as keyof typeof engagementMetricsMapper] ?? {};
                  const floatValue = parseFloat(value);

                  return (
                    <div key={label} className="basis-1/3">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500">{label}</p>

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
                        <span className="font-bold">
                          {shouldRound ? Math.round(floatValue) : floatValue}
                        </span>
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
      </div>
    </div>
  );
};
