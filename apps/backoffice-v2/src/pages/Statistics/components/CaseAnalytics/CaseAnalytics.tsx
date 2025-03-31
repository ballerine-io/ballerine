import { FunctionComponent } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { z } from 'zod';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { MetricsResponseSchema } from '@/domains/business-reports/hooks/queries/useBusinessReportMetricsQuery/useBusinessReportMetricsQuery';

export const CaseAnalytics: FunctionComponent<
  Pick<
    z.infer<typeof MetricsResponseSchema>,
    'totalActiveMerchants' | 'addedMerchantsCount' | 'removedMerchantsCount'
  >
> = props => {
  // Mock data for cases by status
  const casesByStatusData = [
    { name: 'Pending', value: 45, fill: '#3B82F6' },
    { name: 'In Review', value: 30, fill: '#FCD34D' },
    { name: 'On Hold', value: 15, fill: '#F87171' },
    { name: 'Escalated', value: 10, fill: '#A855F7' },
  ];

  // Mock data for ongoing cases by risk level
  const ongoingCasesByRiskData = [
    { name: 'Low', value: 25, fill: '#34D399' },
    { name: 'Medium', value: 40, fill: '#FCD34D' },
    { name: 'High', value: 35, fill: '#F87171' },
  ];

  // Mock data for approved cases by risk level
  const approvedCasesByRiskData = [
    { name: 'Low', value: 55, fill: '#34D399' },
    { name: 'Medium', value: 30, fill: '#FCD34D' },
    { name: 'High', value: 15, fill: '#F87171' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Cases Analytics</h1>
      <div className={'grid grid-cols-3 gap-6'}>
        {/* Current Ongoing Cases by status */}
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1 font-bold'}>Current Ongoing Cases by Status</CardHeader>
            <CardContent>
              <div className={'flex flex-col items-center space-y-4 pt-3'}>
                <PieChart width={184} height={184}>
                  <text
                    x={92}
                    y={82}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={'text-lg font-bold'}
                  >
                    {casesByStatusData.reduce((acc, curr) => acc + curr.value, 0)}
                  </text>
                  <text x={92} y={102} textAnchor="middle" dominantBaseline="middle">
                    Cases
                  </text>
                  <Pie
                    data={casesByStatusData}
                    cx={87}
                    cy={87}
                    innerRadius={78}
                    outerRadius={92}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={9999}
                  >
                    {casesByStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
                <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                  {casesByStatusData.map((entry, index) => (
                    <li key={index} className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                      <span
                        className={`flex h-2 w-2 rounded-full`}
                        style={{ backgroundColor: entry.fill }}
                      />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>{entry.name}</span>
                        <span>{entry.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Ongoing Cases by risk level */}
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1 font-bold'}>
              Current Ongoing (undecided) Cases by Risk Level
            </CardHeader>
            <CardContent>
              <div className={'flex flex-col items-center space-y-4 pt-3'}>
                <PieChart width={184} height={184}>
                  <text
                    x={92}
                    y={82}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={'text-lg font-bold'}
                  >
                    {ongoingCasesByRiskData.reduce((acc, curr) => acc + curr.value, 0)}
                  </text>
                  <text x={92} y={102} textAnchor="middle" dominantBaseline="middle">
                    Cases
                  </text>
                  <Pie
                    data={ongoingCasesByRiskData}
                    cx={87}
                    cy={87}
                    innerRadius={78}
                    outerRadius={92}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={9999}
                  >
                    {ongoingCasesByRiskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
                <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                  {ongoingCasesByRiskData.map((entry, index) => (
                    <li key={index} className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                      <span
                        className={`flex h-2 w-2 rounded-full`}
                        style={{ backgroundColor: entry.fill }}
                      />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>{entry.name} Risk</span>
                        <span>{entry.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Approved Cases by risk level */}
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1 font-bold'}>
              Current "Approved" Cases by Risk Level
            </CardHeader>
            <CardContent>
              <div className={'flex flex-col items-center space-y-4 pt-3'}>
                <PieChart width={184} height={184}>
                  <text
                    x={92}
                    y={82}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={'text-lg font-bold'}
                  >
                    {approvedCasesByRiskData.reduce((acc, curr) => acc + curr.value, 0)}
                  </text>
                  <text x={92} y={102} textAnchor="middle" dominantBaseline="middle">
                    Cases
                  </text>
                  <Pie
                    data={approvedCasesByRiskData}
                    cx={87}
                    cy={87}
                    innerRadius={78}
                    outerRadius={92}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={9999}
                  >
                    {approvedCasesByRiskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
                <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                  {approvedCasesByRiskData.map((entry, index) => (
                    <li key={index} className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                      <span
                        className={`flex h-2 w-2 rounded-full`}
                        style={{ backgroundColor: entry.fill }}
                      />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>{entry.name} Risk</span>
                        <span>{entry.value}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
