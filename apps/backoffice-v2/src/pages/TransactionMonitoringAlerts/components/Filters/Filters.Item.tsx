import { FunctionComponent } from 'react';
import { Select_ } from '@/common/components/atoms/Select_/Select_';

import { IFilterItemProps } from '@/pages/TransactionMonitoringAlerts/components/Filters/interfaces';

export const FilterItem: FunctionComponent<IFilterItemProps> = ({ title, options }) => {
  return (
    <div className="relative flex flex-col gap-1">
      <h5 className={`text-xs font-bold text-[#00000059]`}>{title}</h5>
      <div className="min-w-[185px]">
        <Select_ options={options} />
      </div>
    </div>
  );
};
