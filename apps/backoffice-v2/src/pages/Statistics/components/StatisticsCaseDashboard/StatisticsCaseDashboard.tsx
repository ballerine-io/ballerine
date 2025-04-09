import { FunctionComponent } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { CaseAnalyticsOutput } from '@/domains/metrics/fetchers';
import { useCaseDailyStats } from '@/domains/metrics/hooks/queries/useCaseDailyStats/useCaseDailyStats';
import { useStatisticsLogic } from '../../hooks/useStatisticsLogic';
import { CasePieChart } from '../CasePieChart/CasePieChart';
import { useStatisticsCaseDashboardLogic } from './hooks/useStatisticsCaseDashboardLogic';
import { Loader2 } from 'lucide-react';

export const StatisticsCaseDashboard: FunctionComponent<{
  from: ReturnType<typeof useStatisticsLogic>['from'];
  to: ReturnType<typeof useStatisticsLogic>['to'];
  setDate: ReturnType<typeof useStatisticsLogic>['setDate'];
}> = ({ from, to, setDate }) => {
  const {
    staticMetrics,
    isLoadingStaticMetrics,
    statusConfig,
    ongoingRiskConfig,
    approvedRiskConfig,
    getStatusColor,
    getRiskColor,
  } = useStatisticsCaseDashboardLogic();

  if (!staticMetrics || isLoadingStaticMetrics) {
    return null;
  }

  const { casesByStatus, ongoingCasesByRisk, approvedCasesByRisk } = staticMetrics;

  return (
    <div className="space-y-6">
      <CaseAnalytics
        casesByStatus={casesByStatus}
        ongoingCasesByRisk={ongoingCasesByRisk}
        approvedCasesByRisk={approvedCasesByRisk}
        statusConfig={statusConfig}
        ongoingRiskConfig={ongoingRiskConfig}
        approvedRiskConfig={approvedRiskConfig}
        getStatusColor={getStatusColor}
        getRiskColor={getRiskColor}
      />

      <CaseGraphs from={from} to={to} setDate={setDate} />
    </div>
  );
};

const CaseAnalytics: FunctionComponent<
  CaseAnalyticsOutput & {
    statusConfig: Record<string, { label: string; color: string }>;
    ongoingRiskConfig: Record<string, { label: string; color: string }>;
    approvedRiskConfig: Record<string, { label: string; color: string }>;
    getStatusColor: (status: string) => string;
    getRiskColor: (risk: string) => string;
  }
> = ({
  casesByStatus,
  ongoingCasesByRisk,
  approvedCasesByRisk,
  statusConfig,
  ongoingRiskConfig,
  approvedRiskConfig,
  getStatusColor,
  getRiskColor,
}) => (
  <div className="space-y-6">
    <h1 className="text-xl font-bold">Cases Analytics</h1>
    <div className={'grid grid-cols-3 gap-6'}>
      <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'pb-1 font-bold'}>Active Cases by Status</CardHeader>
          <CardContent>
            <div className={'flex flex-col items-center space-y-4 pt-3'}>
              <CasePieChart
                data={casesByStatus}
                getColor={getStatusColor}
                nameKey="status"
                config={statusConfig}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'pb-1 font-bold'}>Active Cases by Risk Level</CardHeader>
          <CardContent>
            <div className={'flex flex-col items-center space-y-4 pt-3'}>
              <CasePieChart
                data={ongoingCasesByRisk}
                getColor={getRiskColor}
                nameKey="riskLevel"
                config={ongoingRiskConfig}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'pb-1 font-bold'}>Approved Cases by Risk Level</CardHeader>
          <CardContent>
            <div className={'flex flex-col items-center space-y-4 pt-3'}>
              <CasePieChart
                data={approvedCasesByRisk}
                getColor={getRiskColor}
                nameKey="riskLevel"
                config={approvedRiskConfig}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const CaseGraphs: FunctionComponent<{
  from: ReturnType<typeof useStatisticsLogic>['from'];
  to: ReturnType<typeof useStatisticsLogic>['to'];
  setDate: ReturnType<typeof useStatisticsLogic>['setDate'];
}> = ({ from, to, setDate }) => {
  const { data: liveCasesData, isLoading } = useCaseDailyStats({ from, to });

  return (
    <div className={'mb-6 grid grid-cols-1 gap-6'}>
      <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
        <Card className={'flex h-full flex-col px-3'}>
          <CardHeader className={'flex flex-row items-center justify-between pb-1 font-bold'}>
            <span>Live Cases Per Day</span>
            <DateRangePicker
              toDate={new Date()}
              value={{ from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined }}
              placeholder="Select a date range"
              onChange={setDate}
            />
          </CardHeader>
          <CardContent>
            {(!from || !to) && (
              <div className="flex h-72 w-full items-center justify-center">
                <p className="text-sm text-slate-400">
                  Select a valid date range to view the graph
                </p>
              </div>
            )}
            {isLoading && from && to && (
              <div className="flex h-72 w-full items-center justify-center">
                <Loader2 className="w-8 animate-spin" />
              </div>
            )}

            {!isLoading && liveCasesData && (
              <>
                <p className={'mb-4 text-slate-400'}>
                  Data shown from case opening date to closing date
                </p>

                <div className={'flex h-72 w-full justify-center'}>
                  <BarChart
                    width={800}
                    height={300}
                    data={liveCasesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                    barSize={35}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      padding={{ left: 10, right: 10 }}
                      label={{
                        value: 'Date',
                        position: 'insideBottom',
                        offset: -15,
                        fill: '#4B5563',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      label={{
                        value: 'Cases',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -5,
                        fill: '#4B5563',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{
                        borderRadius: '6px',
                        border: 'none',
                        boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '8px 12px',
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      fillOpacity={0.85}
                    />
                  </BarChart>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
