import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import dayjs from 'dayjs';
import { InfoIcon } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { capitalize } from 'string-ts';

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
  const trafficSources = useMemo(
    () =>
      trafficAnalysis.trafficSources
        .map(({ label, value }) => ({ label, value: parseFloat(value) }))
        .concat({
          label: 'Other',
          value:
            100 -
            trafficAnalysis.trafficSources.reduce((acc, item) => acc + parseFloat(item.value), 0),
        })
        .map(({ label, value }) => ({ label, value: parseFloat(value.toFixed(2)) })),
    [trafficAnalysis.trafficSources],
  );

  return (
    <div className="space-y-8">
      <h3 className="col-span-full text-lg font-bold">Website Credibility Analysis</h3>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className="pt-4 font-bold">Online Reputation Analysis</CardHeader>
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
            {!onlineReputationAnalysis?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pt-4 font-bold">Pricing Analysis</CardHeader>
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
            {!pricingAnalysis?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pt-4 font-bold">Website Structure and Content Evaluation</CardHeader>
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
            {!websiteStructureAndContentEvaluation?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>

      <h3 className="pt-4 font-bold">Traffic Analysis</h3>

      {/* <div className="flex flex-col 2xl:flex-row gap-4 w-full h-auto 2xl:h-96">
        <div className="h-[24rem] 2xl:h-full w-full 2xl:w-3/5"> */}
      <div className="flex gap-4 h-[30rem] w-full">
        <Card className="h-full w-3/5">
          <CardHeader className="pt-4 font-bold">Estimated Monthly Visitors</CardHeader>

          <CardContent className="h-4/5 w-full pb-0 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficAnalysis.montlyVisitsIndicators}>
                <CartesianGrid vertical={false} strokeDasharray="0" />
                <XAxis
                  dataKey="label"
                  tickFormatter={value => dayjs(value, 'MMMM YYYY').format('MMM YYYY')}
                />
                <YAxis tickFormatter={Intl.NumberFormat('en', { notation: 'compact' }).format} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-400 rounded-md px-4 py-2 text-gray-600">
                          <p className="max-w-xs">{`On ${label} the company's website had approx. ${Intl.NumberFormat(
                            'en',
                          ).format(parseInt(String(payload.at(0)?.value)))} visitors`}</p>
                        </div>
                      );
                    }

                    return null;
                  }}
                />
                <Line dataKey="value" stroke="#435597" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <div className="flex 2xl:flex-col gap-4 h-[12rem] 2xl:h-full w-full 2xl:w-2/5">
          <div className="h-full 2xl:h-1/2 w-1/2 2xl:w-full"> */}
        <div className="flex flex-col gap-4 h-full w-2/5">
          <Card className="w-full h-1/2">
            <CardHeader className="pt-4 pb-0 font-bold">Traffic Sources</CardHeader>

            <CardContent className="h-4/5 w-full pb-0 mt-auto">
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
                              className="block w-2 h-2 rounded-full"
                              style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                            />
                            <div className="flex justify-between w-full">
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
            </CardContent>
          </Card>

          {/* <Card className="h-full 2xl:h-1/2 w-1/2 2xl:w-full"> */}
          <Card className="h-1/2 w-full">
            <CardHeader className="pt-4 font-bold">Engagement</CardHeader>

            <CardContent className="h-3/5 flex items-center gap-6">
              {trafficAnalysis?.engagements.map(({ label, value }) => {
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
                            <InfoIcon className="text-gray-500 w-4 h-4" />
                          </TooltipTrigger>

                          <TooltipContent
                            side="right"
                            align="center"
                            className="bg-gray-50 border border-gray-400 text-primary text-sm max-w-[12rem]"
                          >
                            <p className="text-gray-500 text-sm">{description}</p>
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
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
