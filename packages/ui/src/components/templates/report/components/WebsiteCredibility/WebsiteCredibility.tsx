import dayjs from 'dayjs';
import { getAlpha2Code, getName } from 'i18n-iso-countries';
import {
  CalendarIcon,
  InfoIcon,
  MonitorSmartphoneIcon,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Fragment, FunctionComponent, useMemo } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
} from '@/components';
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
import { Separator } from '@/components/atoms/Separator';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { engagementMetricsMapper, GEO_URL, PIE_COLORS } from './constants';
import {
  DisplayableMetricType,
  EngagementType,
  RiskIndicator,
  TrafficDataType,
  WebsiteCredibilityProps,
} from './types';

const getBlueShade = (share: number, maxShare: number) => {
  const minColor = [224, 242, 254] as const;
  const maxColor = [7, 89, 133] as const;

  const minVisibilityThreshold = 0.05;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  let t = share / maxShare;
  t = minVisibilityThreshold + (1 - minVisibilityThreshold) * t;
  t = clamp(t, minVisibilityThreshold, 1);

  const r = Math.round(minColor[0] + (maxColor[0] - minColor[0]) * t);
  const g = Math.round(minColor[1] + (maxColor[1] - minColor[1]) * t);
  const b = Math.round(minColor[2] + (maxColor[2] - minColor[2]) * t);

  return `rgb(${r}, ${g}, ${b})`;
};

const calculateTrend = (data: Array<{ label: string; value: number }>) => {
  if (data.length < 2) {
    return { direction: 'No trend data', percentage: 0 };
  }

  const lastMonthValue = data[data.length - 1]?.value ?? 0;
  const previousMonthValue = data[data.length - 2]?.value ?? 0;
  // Prevent division by zero
  if (previousMonthValue === 0) {
    return { direction: 'No trend data', percentage: 0 };
  }
  const percentageChange = ((lastMonthValue - previousMonthValue) / previousMonthValue) * 100;
  const direction = lastMonthValue > previousMonthValue ? 'up' : 'down';

  return { direction, percentage: Math.abs(percentageChange) };
};

const OnlineReputationCard: FunctionComponent<{
  riskIndicators: Array<RiskIndicator>;
}> = ({ riskIndicators }) => (
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
          'ps-4': !!riskIndicators?.length,
        })}
      >
        {!!riskIndicators?.length &&
          riskIndicators.map(({ reason, sourceUrl }) => (
            <li key={reason} className="list-decimal">
              {reason}
              {!!sourceUrl && (
                <span className="ms-4">
                  (<BallerineLink href={sourceUrl}>source</BallerineLink>)
                </span>
              )}
            </li>
          ))}
        {!riskIndicators?.length && (
          <li>No indications of negative website reputation were detected.</li>
        )}
      </ol>
    </CardContent>
  </Card>
);

const MonthlyVisitorsChart: FunctionComponent<{
  monthlyVisits: Record<string, number> | undefined;
  trend: { direction: string; percentage: number };
}> = ({ monthlyVisits, trend }) => {
  let minVisitors = 0;
  let maxVisitors = 0;

  Object.values(monthlyVisits ?? {}).forEach(num => {
    if (num < minVisitors) {
      minVisitors = num;
    }

    if (num > maxVisitors) {
      maxVisitors = num;
    }
  });

  const visitorsTotalArea = maxVisitors - minVisitors;

  return (
    <Card className="flex h-[30rem] w-full flex-col 2xl:h-full 2xl:w-3/5">
      <CardHeader className="px-6 pb-2 pt-4 font-bold">
        Estimated Monthly Visitors
        <CardDescription className="text-muted-foreground text-sm font-normal">
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>

      <CardContent className="relative h-full p-2">
        {Object.entries(monthlyVisits ?? {}).length > 0 ? (
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
              data={Object.entries(monthlyVisits ?? {}).map(([month, value]) => ({
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
  );
};

const TrafficSourcesChart: FunctionComponent<{
  trafficSources: DisplayableMetricType[];
}> = ({ trafficSources }) => (
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
);

const EngagementMetrics: FunctionComponent<{
  engagements: EngagementType[];
}> = ({ engagements }) => (
  <Card className="h-full w-1/2 2xl:!h-1/2 2xl:!w-full">
    <CardHeader className="px-6 pb-2 pt-4 font-bold">Engagement</CardHeader>

    <CardContent className="flex h-3/5 items-center gap-6 px-4 py-2">
      {engagements.length > 0 ? (
        engagements.map(({ label, value }) => {
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
);

const VisitorsCountryMap: FunctionComponent<{
  visitorsCountries: DisplayableMetricType[];
  visitorsCountriesDateRange: string;
}> = ({ visitorsCountries, visitorsCountriesDateRange }) => {
  const maxShare = useMemo(
    () => Math.max(...visitorsCountries.map(d => d.value)),
    [visitorsCountries],
  );

  return (
    <Card className="flex h-[30rem] w-full flex-col mt-4">
      <CardHeader className="px-6 pb-2 pt-4 font-bold">
        Top Visitors Countries
        <CardDescription className="text-muted-foreground text-sm font-normal flex gap-2 items-center mt-2">
          <CalendarIcon className="size-4" />
          <span>{visitorsCountriesDateRange}</span>
          <MonitorSmartphoneIcon className="size-4" />
          <span>All traffic</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="relative h-full p-2 flex gap-2">
        {visitorsCountries.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No Top Visitors Countries Data Available
          </div>
        ) : (
          <>
            <ComposableMap projectionConfig={{ scale: 150 }} className="w-1/2 h-full">
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const countryName = geo.properties.name;
                    const countryCode =
                      getAlpha2Code(countryName, 'en') ?? countryName.toUpperCase();
                    const allCountryNames = getName(countryCode, 'en', { select: 'all' });
                    const countryData = countryCode
                      ? visitorsCountries.find(
                          d => allCountryNames?.includes(d.label) || d.label === countryCode,
                        )
                      : null;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={countryData ? getBlueShade(countryData.value, maxShare) : '#F0F0F0'}
                        stroke={countryData ? getBlueShade(countryData.value, maxShare) : '#D6D6DA'}
                        strokeWidth={countryData ? 1 : 0.5}
                        style={{
                          default: {
                            outline: 'none',
                          },
                          hover: {
                            fill: countryData ? '#1E40AF' : '#D6D6DA',
                            stroke: countryData ? '#1E40AF' : '#D6D6DA',
                            outline: 'none',
                          },
                        }}
                        data-tip={
                          countryData ? `${countryName}: ${countryData.value}%` : countryName || ''
                        }
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            <div className="w-1/2 flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between font-medium">
                <div className="w-1/2">Country</div>
                <div className="w-1/2">Traffic Share</div>
              </div>

              <Separator className="w-full" />

              {visitorsCountries.map(({ label, value }, index) => {
                const countryCode = getAlpha2Code(label, 'en') ?? label.toUpperCase();

                return (
                  <Fragment key={label}>
                    <div className="flex items-center justify-between">
                      <div className="w-1/2 flex items-center gap-2">
                        <CircleFlag countryCode={countryCode.toLowerCase()} className="size-4" />

                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <div className="w-1/2 flex items-center gap-2">
                        <span className="text-sm text-gray-700 w-10">{value}%</span>
                        <div className="flex-1 h-2 bg-gray-200 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    </div>
                    {index < visitorsCountries.length - 1 && <Separator className="w-full" />}
                  </Fragment>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const TrafficAnalysisCard: FunctionComponent<{
  trafficData: TrafficDataType;
  trafficSources: DisplayableMetricType[];
  visitorsCountries: DisplayableMetricType[];
  visitorsCountriesDateRange: string;
  engagements: EngagementType[];
  trend: { direction: string; percentage: number };
}> = ({
  trafficData,
  trafficSources,
  visitorsCountries,
  visitorsCountriesDateRange,
  engagements,
  trend,
}) => (
  <Card>
    <ContentTooltip
      description={
        <p>
          Analyzes visitor volume and sources to gauge popularity and detect red flags in expected
          merchant behavior.
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

    <CardContent className="px-4 pb-4 pt-0">
      <div className="flex h-auto w-full flex-col gap-4 2xl:!h-[30rem] 2xl:!flex-row">
        <MonthlyVisitorsChart
          monthlyVisits={trafficData.monthlyVisits ?? undefined}
          trend={trend}
        />

        <div className="flex h-[15rem] w-full gap-4 2xl:h-full 2xl:w-2/5 2xl:flex-col">
          <TrafficSourcesChart trafficSources={trafficSources} />
          <EngagementMetrics engagements={engagements} />
        </div>
      </div>

      <VisitorsCountryMap
        visitorsCountries={visitorsCountries}
        visitorsCountriesDateRange={visitorsCountriesDateRange}
      />
    </CardContent>
  </Card>
);

const WebsiteStructureCard: FunctionComponent<{
  websiteStructureRiskIndicators: Array<RiskIndicator>;
}> = ({ websiteStructureRiskIndicators }) => (
  <Card>
    <div>
      <ContentTooltip
        description={
          <p>
            Evaluates the quality and layout of the website, identifying issues like missing legal
            pages such as terms and conditions.
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
      <div className="space-y-4">
        <Accordion type="multiple">
          {websiteStructureRiskIndicators.length > 0 ? (
            websiteStructureRiskIndicators.map((indicator, index) => (
              <AccordionItem
                key={`${index}-${indicator.id}`}
                className={ctw(
                  'border border-gray-200 shadow-sm rounded-none',
                  index === 0 && 'rounded-t-lg',
                )}
                value={`${index}-${indicator.id}`}
              >
                <AccordionTrigger
                  className="px-4 py-3 hover:no-underline flex items-center justify-between [&>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0 font-normal"
                  chevronLeft={true}
                >
                  <div className="flex-1 flex items-center w-full ml-10">
                    <div className="flex items-center space-x-3 w-3/5">
                      {!indicator.status || indicator.status === 'missing' ? (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      ) : indicator.status === 'detected' ? (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <InfoIcon className="w-5 h-5 text-gray-500" />
                      )}

                      <h3 className="text-base font-medium text-gray-900">
                        {indicator.pageContext || indicator.name}
                      </h3>
                    </div>

                    {indicator.status && (
                      <span className="text-sm">{capitalize(indicator.status)}</span>
                    )}

                    <div className="ml-auto text-sm font-medium">
                      {indicator.sourceUrl ? (
                        <BallerineLink href={indicator.sourceUrl} className="px-2 py-1 h-auto">
                          View
                        </BallerineLink>
                      ) : (
                        <span className="text-gray-400 cursor-not-allowed">View</span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-slate-100">
                  <p className="text-gray-600">{indicator.reason}</p>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="text-gray-600">
              No structural issues on missing compliance pages were detected.
            </div>
          )}
        </Accordion>
      </div>
    </CardContent>
  </Card>
);

const PricingAnalysisCard: FunctionComponent<{
  pricingRiskIndicators: Array<RiskIndicator>;
}> = ({ pricingRiskIndicators }) => (
  <Card>
    <div>
      <ContentTooltip
        description={
          <p>
            Analyzes website pricing strategies to detect anomalies, flagging deceptive practices
            and identifying potential scams or counterfeit goods.
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
            No indications of suspicious pricing or anomalies in the website's pricing were
            detected.
          </li>
        )}
      </ol>
    </CardContent>
  </Card>
);

export const WebsiteCredibility: FunctionComponent<WebsiteCredibilityProps> = ({
  websiteReputationRiskIndicators,
  pricingRiskIndicators,
  websiteStructureRiskIndicators,
  trafficData,
  trafficRiskIndicators,
  visitorsCountriesDateRange,
}) => {
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
  ).filter(({ value }) => typeof value === 'string') as EngagementType[];

  const visitorsCountries = useMemo(() => {
    if (!Object.keys(trafficData.visitorsCountries?.data ?? {}).length) {
      return [];
    }

    const values = Object.entries(trafficData.visitorsCountries?.data ?? {})
      .map(([label, value]) => ({
        label,
        value: Number((value * 100).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);

    return values;
  }, [trafficData.visitorsCountries?.data]);

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

      <OnlineReputationCard riskIndicators={websiteReputationRiskIndicators} />

      <TrafficAnalysisCard
        visitorsCountries={visitorsCountries}
        visitorsCountriesDateRange={visitorsCountriesDateRange}
        trafficData={trafficData}
        trafficSources={trafficSources}
        engagements={engagements}
        trend={trend}
      />

      <WebsiteStructureCard websiteStructureRiskIndicators={websiteStructureRiskIndicators} />

      <PricingAnalysisCard pricingRiskIndicators={pricingRiskIndicators} />
    </div>
  );
};
