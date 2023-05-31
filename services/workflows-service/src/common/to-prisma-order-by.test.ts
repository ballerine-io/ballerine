import { toPrismaOrderBy } from '@/common/to-prisma-order-by';

describe(toPrismaOrderBy.name, () => {
  describe('when orderBy is empty', () => {
    it('returns empty array', () => {
      const orderBy = '';

      const result = toPrismaOrderBy(orderBy);

      expect<never[]>(result).toEqual([]);
    });
  });

  describe('when orderBy column has minus prefix', () => {
    it('returns desc order', () => {
      const orderBy = '-createdAt';

      const result = toPrismaOrderBy(orderBy);

      expect<Record<'createdAt', 'asc' | 'desc'>[]>(result).toEqual([{ createdAt: 'desc' }]);
    });
  });

  describe('when orderBy column has no prefix', () => {
    it('returns asc order', () => {
      const orderBy = 'createdAt';

      const result = toPrismaOrderBy(orderBy);

      expect<Record<'createdAt', 'asc' | 'desc'>[]>(result).toEqual([{ createdAt: 'asc' }]);
    });
  });

  describe('when orderBy has multiple columns', () => {
    it('returns multiple orders', () => {
      const orderBy = 'createdAt,-updatedAt';

      const result = toPrismaOrderBy(orderBy);

      expect<Record<'createdAt' | 'updatedAt', 'asc' | 'desc'>[]>(result).toEqual([
        { createdAt: 'asc' },
        { updatedAt: 'desc' },
      ]);
    });
  });
});
