import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchTransactions } from '@/domains/transactions/fetchers';

export const transactionsQueryKeys = createQueryKeys('transactions', {
  list: ({ page, pageSize, ...params }: { businessId: string; page: number; pageSize: number }) => {
    const data = {
      ...params,
      page: {
        number: Number(page),
        size: Number(pageSize),
      },
    };

    return {
      queryKey: [data],
      queryFn: () => fetchTransactions(data),
    };
  },
});
