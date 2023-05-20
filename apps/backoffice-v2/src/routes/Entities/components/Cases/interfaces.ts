import { Item } from './Cases.Item';
import { List } from './Cases.List';
import { DivComponent, TRouteId } from '../../../../types';
import { ChangeEventHandler } from 'react';
import { SkeletonItem } from './Cases.SkeletonItem';
import { TIndividual } from '../../../../individuals/types';

export interface ICasesChildren {
  List: typeof List;
  Item: typeof Item;
  SkeletonItem: typeof SkeletonItem;
}

export interface ICasesProps extends DivComponent {
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onFilter: (filterBy: keyof TIndividual) => (filters: Array<string>) => void;
  onSortBy: ChangeEventHandler<HTMLSelectElement>;
  onSortDir: () => void;
  routerId: TRouteId;
  search: string;
}
