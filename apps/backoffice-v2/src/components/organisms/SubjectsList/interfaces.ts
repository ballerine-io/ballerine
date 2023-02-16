import { Item } from './SubjectsList.Item';
import { List } from './SubjectsList.List';
import { DivComponent } from '../../../types';
import { ChangeEventHandler } from 'react';
import { TEndUser } from '../../../api/types';
import { SkeletonItem } from 'components/organisms/SubjectsList/SubjectsList.SkeletonItem';

export interface ISubjectsListChildren {
  List: typeof List;
  Item: typeof Item;
  SkeletonItem: typeof SkeletonItem;
}

export interface ISubjectsListProps extends DivComponent {
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onFilter: (filterBy: keyof TEndUser) => (filters: Array<string>) => void;
  onSortBy: ChangeEventHandler<HTMLSelectElement>;
  onSortDir: () => void;
  search: string;
}
