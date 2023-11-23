import { Skeleton } from '@/components/atoms/Skeleton';
import { IUserCaseResolvingStats } from '@/domains/user/api/users-stats';
import { ListItem } from '@/pages/Overview/components/molecules/UsersResolvingStatsList/ListItem';
import Scrollbars from 'react-custom-scrollbars';

export interface Props {
  items: IUserCaseResolvingStats[];
  isLoading?: boolean;
}

export const UsersResolvingStatsList = ({ items, isLoading }: Props) => {
  const isEmpty = !isLoading && !items.length;

  return (
    <Scrollbars autoHide>
      <div className="flex h-full flex-col gap-4 pr-4">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          items.map(item => <ListItem key={item.id} item={item} />)
        )}
        {isEmpty ? <span className="font-inter">No activity found.</span> : null}
      </div>
    </Scrollbars>
  );
};
