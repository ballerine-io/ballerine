import { TBusiness, TBusinesses } from '../businesses/types';
import { TIndividual, TIndividuals } from '../individuals/types';

export type TEntity = TIndividual | TBusiness;
export type TEntities = TIndividuals | TBusinesses;
