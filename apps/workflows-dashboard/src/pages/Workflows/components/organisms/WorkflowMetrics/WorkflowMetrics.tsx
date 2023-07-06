import { MetricCard } from '@app/components/molecules/MetricCard';

export const WorkflowMetrics = () => {
  // const { data: metric } = useWorkflowsMetric();

  return (
    <div className="flex w-full gap-4">
      <MetricCard
        className="min-h-[260px] w-1/4"
        title={<MetricCard.Title title="Active per workflow" />}
        content={
          <MetricCard.Content>
            {/* <WorkflowChart size={160} innerRadius={60} outerRadius={80} data={pieChartData} /> */}
          </MetricCard.Content>
        }
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Logged in agents" />}
        content="hello world"
        description="(last 1 hour)"
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Assigned cases per agent" />}
        content="hello world"
        description="(last 1 hour)"
      />
      <MetricCard
        className="w-1/4 min-w-[260px]"
        title={<MetricCard.Title title="Amount of cases per status" />}
        content="hello world"
        description="(last 1 hour)"
      />
    </div>
  );
};
