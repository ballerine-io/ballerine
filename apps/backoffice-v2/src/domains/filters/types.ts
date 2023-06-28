import { TEntityType } from 'src/domains/entities/types';

export interface TFilter {
  id: string;
  name: string;
  entity: TEntityType;
}
