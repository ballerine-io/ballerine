import { Prisma } from '@prisma/client';

type Direction = 'asc' | 'desc';
type IndividualsColumn = 'firstName' | 'lastName' | 'email';
type BusinessesColumn = 'companyName';
type WorkflowColumn = 'createdAt';

type AvailableColumns<T extends 'individuals' | 'businesses'> = T extends 'individuals'
  ? IndividualsColumn | WorkflowColumn
  : BusinessesColumn | WorkflowColumn;

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

  if (entityType === 'individuals' && ['firstName', 'lastName', 'email'].includes(column)) {
    return {
      endUser: {
        [column]: direction,
      } as { [K in TColumn]: TDirection },
    };
  }

  if (entityType === 'businesses' && column === 'companyName') {
    return {
      business: {
        [column]: direction,
      },
    };
  }

  return {
    [column]: direction,
  };
};
