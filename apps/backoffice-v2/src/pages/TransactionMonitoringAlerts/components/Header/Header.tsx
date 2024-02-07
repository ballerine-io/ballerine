import { Button } from '@/common/components/atoms/Button/Button';
import { Search } from '@/pages/TransactionMonitoringAlerts/components/Search';
import { Filters } from '@/pages/TransactionMonitoringAlerts/components/Filters';

export const Header = () => {
  return (
    <div className="flex items-end justify-between pb-2">
      <div className="flex gap-6">
        <Search />
        <Filters />
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
