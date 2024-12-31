import { ctw } from '@/common';
import { Card, CardContent, CardHeader } from '@/components';
import { BallerineLink } from '@/components/atoms/BallerineLink/BallerineLink';
import { RiskIndicators } from '@/components/molecules/RiskIndicators/RiskIndicators';
import { FunctionComponent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
  console.log(trafficAnalysis);
  // const isEmptyTrafficAnalysis = !trafficAnalysis.flatMap(({ items }) => items)?.length;

  return (
    <div className={'space-y-8'}>
      <h3 className={'col-span-full text-lg font-bold'}>Website Credibility Analysis</h3>
      <RiskIndicators violations={violations} />
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Online Reputation Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!onlineReputationAnalysis?.length,
            })}
          >
            {!!onlineReputationAnalysis?.length &&
              onlineReputationAnalysis.map(({ label, url }) => (
                <li key={label} className={'list-decimal'}>
                  {label}
                  {!!url && (
                    <span className={'ms-4'}>
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
        <CardHeader className={'pt-4 font-bold'}>Pricing Analysis</CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!pricingAnalysis?.length,
            })}
          >
            {!!pricingAnalysis?.length &&
              pricingAnalysis.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!pricingAnalysis?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>
          Website Structure and Content Evaluation
        </CardHeader>
        <CardContent>
          <ol
            className={ctw({
              'ps-4': !!websiteStructureAndContentEvaluation?.length,
            })}
          >
            {!!websiteStructureAndContentEvaluation?.length &&
              websiteStructureAndContentEvaluation.map(warning => (
                <li key={warning} className={'list-decimal'}>
                  {warning}
                </li>
              ))}
            {!websiteStructureAndContentEvaluation?.length && <li>No Indications Detected.</li>}
          </ol>
        </CardContent>
      </Card>
      {/* <Card> */}
      <h3 className={'pt-4 font-bold'}>Traffic Analysis</h3>
      {/* <CardContent className={'space-y-4'}> */}
      <div className="flex gap-8 w-full h-80">
        <div className="h-full w-3/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trafficAnalysis.montlyVisitsIndicators}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={46}
            >
              <CartesianGrid vertical={false} strokeDasharray="0" />
              <XAxis dataKey="label" fill="rgb(144, 144, 144)" />
              <YAxis />
              <Tooltip />
              {/* <Legend verticalAlign="top" align={'right'} content={<CustomLegend />} /> */}
              <Bar dataKey="value" fill="rgb(0, 122, 255)" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-8 h-full w-2/5">
          <ResponsiveContainer width="100%" height="50%">
            <PieChart>
              {/* <text
                x={35}
                y={37}
                textAnchor="middle"
                dominantBaseline="middle"
                // className={ctw('font-bold', {
                //   'text-sm': assignedTags?.toString().length >= 5,
                // })}
              >
                Hello world
              </text> */}
              <Pie
                data={trafficAnalysis.trafficSources}
                cx={30}
                cy={30}
                innerRadius={28}
                outerRadius={35}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                cornerRadius={9999}
              >
                {/* {tagsWithColor?.map(filter => {
            return (
              <Cell
                className={'outline-none'}
                key={filter.id}
                style={{
                  fill: filter.color,
                }}
              />
            );
          })} */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <Card className="h-1/2 w-full">
            <CardHeader className="pt-4 font-bold">Engagement</CardHeader>
            <CardContent className="flex items-center gap-6">
              {trafficAnalysis?.engagements.map(({ label, value }) => (
                <div key={label} className="basis-1/3">
                  <p className="text-gray-500">{label}</p>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* {!isEmptyTrafficAnalysis &&
        trafficAnalysis?.map(({ label, items }) => (
          <ul className={'ps-4'} key={label}>
            <li className={'list-disc'}>{label}</li>
            <ul className={'ps-4'}>
              {!!items?.length &&
                items.map(item => (
                  <li key={label} className={'list-disc'}>
                    {item}
                  </li>
                ))}
              {!isEmptyTrafficAnalysis && !items?.length && (
                <li>No {label?.toLowerCase()} detected.</li>
              )}
            </ul>
          </ul>
        ))} */}
      {/* {isEmptyTrafficAnalysis && <>No traffic data detected.</>} */}
      {/* </CardContent>
      </Card> */}
    </div>
  );
};
