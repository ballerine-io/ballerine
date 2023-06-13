import { Prisma } from '@prisma/client';

type Direction = 'asc' | 'desc';
type IndividualsColumns = 'firstName' | 'lastName' | 'email';
type BusinessesColumns = 'companyName';
type WorkflowColumns = 'createdAt';

type AvailableColumns<T extends 'individuals' | 'businesses'> = T extends 'individuals'
  ? IndividualsColumns | WorkflowColumns
  : BusinessesColumns | WorkflowColumns;

type EntityType = 'individuals' | 'businesses';

export const toPrismaOrderBy = <
  TEntityType extends EntityType,
  TColumn extends AvailableColumns<TEntityType>,
  TDirection extends Direction,
>(
  orderBy: `${TColumn}:${TDirection}`,
  entityType: TEntityType,
): Prisma.WorkflowRuntimeDataOrderByWithRelationInput => {
  const [column, direction] = orderBy.split(':') as [TColumn, TDirection];

  if (column === 'createdAt') {
    return {
      [column]: direction,
    };
  }

  if (entityType === 'individuals') {
    return {
      endUser: {
        [column]: direction,
      },
    };
  }

  return {
    business: {
      [column]: direction,
    },
  };
};
