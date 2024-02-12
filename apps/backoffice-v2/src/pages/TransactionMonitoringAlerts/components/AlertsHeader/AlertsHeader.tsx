import { Button } from '@/common/components/atoms/Button/Button';
import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { AlertsFilters } from 'src/pages/TransactionMonitoringAlerts/components/AlertsFilters';
import { ComponentProps, FunctionComponent } from 'react';
import { TUsers } from '@/domains/users/types';
import { useSelect } from '@/common/hooks/useSelect/useSelect';

export const AlertsHeader: FunctionComponent<{
  assignees: TUsers;
  authenticatedUserId: string | null;
  search: ComponentProps<typeof Search>['value'];
  onSearch: (search: string) => void;
}> = ({ assignees, authenticatedUserId, search, onSearch }) => {
  const { selected } = useSelect();
  const isNoAlertsSelected = Object.keys(selected ?? {}).length === 0;

  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        {/*  Uncomment when search is implemented server-side */}
        {/*<Search value={search} onChange={onSearch} />*/}
        <AlertsFilters assignees={assignees} authenticatedUserId={authenticatedUserId} />
      </div>
      <div className="flex gap-4">
        <Button variant="outline" size={'wide'} disabled={isNoAlertsSelected}>
          Assign
        </Button>
        <Button variant="outline" size={'wide'}>
          Decision
        </Button>
      </div>
    </div>
  );
};
