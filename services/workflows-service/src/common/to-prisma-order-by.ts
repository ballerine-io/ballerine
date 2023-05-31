type RemoveSortDirectionPrefix<T> = T extends `-${infer Y}` ? Y : T;
type CommaSeparatedStringToUnion<TString> = TString extends `${infer First},${infer Rest}`
  ? First | CommaSeparatedStringToUnion<Rest>
  : TString;
type ExtractOrderByColumns<TOrderBy extends string> = RemoveSortDirectionPrefix<
  CommaSeparatedStringToUnion<TOrderBy>
>;

type ToPrismaOrderBy<TOrderBy extends string> = TOrderBy extends ''
  ? never[]
  : Record<ExtractOrderByColumns<TOrderBy>, 'asc' | 'desc'>[];

/**
 * Converts `orderBy` string to Prisma `orderBy` object
 *
 * @example toPrismaOrderBy('-createdAt,updatedAt') => [{ createdAt: 'desc' }, { updatedAt: 'asc' }]
 *
 * @param orderBy
 *
 * @returns Prisma `orderBy` object
 */
export const toPrismaOrderBy = <TOrderBy extends string>(orderBy: TOrderBy) => {
  if (orderBy === '') {
    return [];
  }

  return orderBy.split(',').map(item => {
    if (item.startsWith('-')) {
      return { [item.substring(1)]: 'desc' };
    }

    return { [item]: 'asc' };
  }) as ToPrismaOrderBy<TOrderBy>;
};
