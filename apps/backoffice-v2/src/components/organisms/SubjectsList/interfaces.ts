import { Item } from './SubjectsList.Item';
import { List } from './SubjectsList.List';
import { DivComponent, TRouteId } from '../../../types';
import { ChangeEventHandler } from 'react';
import { SkeletonItem } from 'components/organisms/SubjectsList/SubjectsList.SkeletonItem';
import { TIndividual } from '../../../individuals/types';

export interface ISubjectsListChildren {
  List: typeof List;
  Item: typeof Item;
  SkeletonItem: typeof SkeletonItem;
}

export interface ISubjectsListProps extends DivComponent {
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onFilter: (filterBy: keyof TIndividual) => (filters: Array<string>) => void;
  onSortBy: ChangeEventHandler<HTMLSelectElement>;
  onSortDir: () => void;
  routerId: TRouteId;
  search: string;
}
