type OrderDirection = 'asc' | 'desc';

/**
 * Converts `orderBy` string to Prisma `orderBy` object
 *
 * @example toPrismaOrderBy('-createdAt,updatedAt') => [{ createdAt: 'desc' }, { updatedAt: 'asc' }]
 *
 * @param orderBy
 */
export const toPrismaOrderBy = (orderBy: string): Record<string, OrderDirection>[] => {
  if (orderBy === '') {
    return [];
  }

  return orderBy.split(',').map(item => {
    if (item.startsWith('-')) {
      return { [item.substring(1)]: 'desc' };
    }

    return { [item]: 'asc' };
  });
};
