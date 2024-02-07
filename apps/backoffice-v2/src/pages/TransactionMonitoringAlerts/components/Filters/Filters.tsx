import { FilterItem } from '@/pages/TransactionMonitoringAlerts/components/Filters/Filters.Item';

export const Filters = () => {
  const actions = [
    {
      label: 'All',
      value: 'all',
    },
  ];

  return (
    <div>
      <h4 className={'leading-0 min-h-[16px] pb-2.5 text-xs font-bold'}>Filters</h4>
      <div className={`flex gap-x-2`}>
        <FilterItem title="Assignee" options={actions} />
        <FilterItem title="Alert Type" options={actions} />
        <FilterItem title="Status" options={actions} />
      </div>
    </div>
  );
};
