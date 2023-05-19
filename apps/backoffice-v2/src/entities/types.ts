import { TEndUser, TEndUsers } from '../api/types';
import { TBusiness, TBusinesses } from '../businesses/types';

export type TEntity = TEndUser | TBusiness;
export type TEntities = TEndUsers | TBusinesses;
