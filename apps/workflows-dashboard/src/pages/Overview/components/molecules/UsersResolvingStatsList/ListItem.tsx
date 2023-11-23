import { Avatar, AvatarImage } from '@/components/atoms/Avatar';
import { IUserCaseResolvingStats } from '@/domains/user/api/users-stats';

interface Props {
  item: IUserCaseResolvingStats;
}

export const ListItem = ({ item }: Props) => {
  return (
    <div className="flex items-center">
      <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
        <AvatarImage src="/avatar.png" alt="Avatar" />
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{`${item.firstName} ${item.lastName}`}</p>
        <p className="text-muted-foreground text-sm">{item.email}</p>
      </div>
      <div className="ml-auto font-medium">{item.casesCount}</div>
    </div>
  );
};
