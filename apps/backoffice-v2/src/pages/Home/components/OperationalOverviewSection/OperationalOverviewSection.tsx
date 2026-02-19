import { Separator } from '@radix-ui/react-separator';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardDescription } from '@/common/components/atoms/Card/Card.Description';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardTitle } from '@/common/components/atoms/Card/Card.Title';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { StatsCard } from '@/pages/Home/components/StatsCard/StatsCard';
import { CasePieChart } from '../CasePieChart/CasePieChart';

export const OperationalOverviewSection = ({
  from,
  to,
  setDate,
}: {
  from: ReturnType<typeof useHomeLogic>['mmFrom'];
  to: ReturnType<typeof useHomeLogic>['mmTo'];
  setDate: ReturnType<typeof useHomeLogic>['setMMDate'];
}) => {
  const caseByStatusData = [
    { status: 'Collection In Progress', count: 76 },
    { status: 'Manual Review', count: 41 },
    { status: 'Approved', count: 109 },
    { status: 'Revisions', count: 34 },
    { status: 'Rejected', count: 82 },
  ];

  const totalActiveCases = 228;
  const manualReviewCasesAssignmentData = {
    unassigned: {
      count: 21,
    },
    assigned: {
      count: 20,
      reviewers: [
        { name: 'Nitzan Guy', count: 9 },
        { name: 'Alon Peretz', count: 8 },
        { name: 'Adi Nir', count: 3 },
      ],
    },
  };

  return (
    <>
      <Separator className="mb-6 h-px w-full bg-gray-300" />

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-900">Operational Overview</h3>

        <DateRangePicker
          toDate={new Date()}
          value={{
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }}
          onChange={setDate}
          className="justify-end"
        />
      </div>

      <div className="mb-8 grid grid-cols-3 gap-6">
        <StatsCard
          value={'38.4%'}
          title="Merchant Onboarding Conversion Rate"
          description="Based on application to decision data in selected time range"
          className="border border-purple-300"
          style={{
            background:
              'linear-gradient(30deg, rgba(198, 193, 248, 0.44) 0%, rgba(255, 255, 255, 1) 52%',
          }}
          tendency={{
            kind: 'positive',
            direction: 'up',
            value: '25%',
          }}
        />

        <StatsCard
          value={'27 hr'}
          title="AVG. Time to Onboarded Merchants"
          description="Based on application to decision data in selected time range"
          className="border border-pink-300"
          style={{
            background:
              'linear-gradient(30deg, rgba(242, 177, 255, 0.44) 0%, rgba(255, 255, 255, 1) 50%',
          }}
          tendency={{
            kind: 'neutral',
            direction: 'up',
            value: '10%',
          }}
        />

        <StatsCard
          value={'$24.3'}
          title="AVG. Vendor Cost per Onboarding"
          description="Based on vendor and checks cost in selected time range"
          className="border border-blue-300"
          style={{
            background:
              'linear-gradient(30deg, rgba(174, 213, 255, 0.44) 0%, rgba(255, 255, 255, 1) 50%',
          }}
          tendency={{
            kind: 'negative',
            direction: 'up',
            value: '15%',
          }}
        />

        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-medium">New Cases vs. Completed Cases</CardTitle>
            <CardDescription className="text-muted-foreground">
              Number of cases that haven&apos;t reached a final decision, by Status, in selected
              time range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { period: 'APR 1-7', completed: 35, new: 10 },
                    { period: 'APR 8-13', completed: 27, new: 6 },
                    { period: 'APR 14-21', completed: 20, new: 9 },
                    { period: 'APR 22-28', completed: 7, new: 13 },
                    { period: 'APR 28-MAY 1', completed: 24, new: 5 },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="period" />
                  <Tooltip
                    formatter={(value, name) => {
                      return [value, name === 'completed' ? 'Completed Cases' : 'New Cases'];
                    }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]}>
                    <LabelList
                      dataKey="completed"
                      position="inside"
                      formatter={value => value}
                      style={{ fill: 'white', fontSize: '12px' }}
                    />
                  </Bar>
                  <Bar dataKey="new" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="new"
                      position="inside"
                      formatter={value => value}
                      style={{ fill: 'white', fontSize: '12px' }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-xl font-medium text-gray-900">All Cases by Status</h3>
          <p className="mb-4 text-sm text-gray-500">Distribution of all active cases by status</p>
          <div className={'flex flex-col items-center space-y-4 pt-3'}>
            <CasePieChart
              totalValue={totalActiveCases}
              data={caseByStatusData.map(item => ({
                status: item.status,
                count: item.count,
              }))}
              getDefinition={status => {
                const statusMap = {
                  'Collection In Progress': { color: '#936AF6', text: 'Collection In Progress' },
                  'Manual Review': { color: '#007AFF', text: 'Manual Review' },
                  Approved: { color: '#4CAF50', text: 'Approved' },
                  Revisions: { color: '#FFB74D', text: 'Revisions' },
                  Rejected: { color: '#F44336', text: 'Rejected' },
                };
                
return statusMap[status] || { color: '#65AFFF', text: status };
              }}
              nameKey="status"
              valueKey="count"
              config={caseByStatusData.reduce((acc, curr) => {
                const statusMap = {
                  'Collection In Progress': { color: '#936AF6' },
                  'Manual Review': { color: '#007AFF' },
                  Approved: { color: '#4CAF50' },
                  Revisions: { color: '#FFB74D' },
                  Rejected: { color: '#F44336' },
                };

                return {
                  ...acc,
                  [curr.status]: {
                    label: curr.status,
                    color: statusMap[curr.status]?.color || '#65AFFF',
                  },
                };
              }, {})}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-xl font-medium text-gray-900">Overall Active Cases</h3>
          <p className="mb-4 text-sm text-gray-500">
            Cases that haven't reached a decision, in selected time range
          </p>
          <div className="mb-6 flex items-center justify-center">
            <span className="text-4xl font-semibold text-indigo-600">{totalActiveCases}</span>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 font-medium text-gray-700">Manual Review Cases</h4>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Unassigned</p>
                <p className="text-xl font-medium text-gray-900">
                  {manualReviewCasesAssignmentData.unassigned.count}
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-500">Assigned</p>
                <p className="text-xl font-medium text-gray-900">
                  {manualReviewCasesAssignmentData.assigned.count}
                </p>
              </div>
            </div>

            <h5 className="mb-2 text-sm font-medium text-gray-700">Assignment breakdown:</h5>
            <div className="space-y-2">
              {manualReviewCasesAssignmentData.assigned.reviewers.map((reviewer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                >
                  <span className="text-sm text-gray-700">{reviewer.name}</span>
                  <span className="rounded bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-800">
                    {reviewer.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StatsCard
          value={'33 hr 4 min'}
          title="Overall Onboarding Time"
          description="Time from application to final decision, in selected time range"
          tendency={{
            kind: 'negative',
            direction: 'up',
            value: '25%',
          }}
        />

        <StatsCard
          value={'3 hr 21 min'}
          title="AVG. Time from Review to Decision"
          description="Time from Manual Review readiness to final decision, in selected time range"
          tendency={{
            kind: 'neutral',
            direction: 'up',
            value: '10%',
          }}
        />

        <StatsCard
          value={'16 hr 32 min'}
          title="AVG. Time from Collection to Review"
          description="Time from collection flow initiation to submission, in selected time range"
          tendency={{
            kind: 'negative',
            direction: 'up',
            value: '40%',
          }}
        />

        <StatsCard
          value={'12 hr 7 min'}
          title="AVG. Time from Revisions to Review"
          description="Time from asking for revisions until provided, in selected time range"
          tendency={{
            kind: 'positive',
            direction: 'down',
            value: '20%',
          }}
        />
      </div>
    </>
  );
};
