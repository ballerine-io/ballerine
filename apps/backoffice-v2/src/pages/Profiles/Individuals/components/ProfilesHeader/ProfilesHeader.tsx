import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import React, { ComponentProps, FunctionComponent } from 'react';
import { ProfilesFilters } from '@/pages/Profiles/Individuals/components/ProfilesFilters';

export const ProfilesHeader: FunctionComponent<{
  search: ComponentProps<typeof Search>['value'];
  onSearch: (search: string) => void;
}> = ({ search, onSearch }) => {
  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        {/*  Uncomment when search is implemented server-side */}
        {/*<Search value={search} onChange={onSearch} />*/}
        <ProfilesFilters />
      </div>
    </div>
  );
};
