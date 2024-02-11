import { Button } from '@/common/components/atoms/Button/Button';
import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { Filters } from '@/pages/TransactionMonitoringAlerts/components/Filters';
import { FunctionComponent } from 'react';
import { TUsers } from '@/domains/users/types';

export const AlertsHeader: FunctionComponent<{
  assignees: TUsers;
  authenticatedUserId: string | null;
}> = ({ assignees, authenticatedUserId }) => {
  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        <Search />
        <Filters assignees={assignees} authenticatedUserId={authenticatedUserId} />
      </div>
      <div className="flex gap-4">
        <Button variant="outline" size={'wide'}>
          Assign
        </Button>
        <Button variant="outline" size={'wide'}>
          Decision
        </Button>
      </div>
    </div>
  );
};
