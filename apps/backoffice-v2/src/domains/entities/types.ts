import { TBusiness, TBusinesses } from '../businesses/types';
import { TIndividual, TIndividuals } from '../individuals/types';
import { queryKeys as entityTypeQueryKeys } from './query-keys';

export type TEntity = TIndividual | TBusiness;
export type TEntities = TIndividuals | TBusinesses;
export type TEntityType = keyof typeof entityTypeQueryKeys;
