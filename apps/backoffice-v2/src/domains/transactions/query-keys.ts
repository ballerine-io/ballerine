import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchTransactions } from '@/domains/transactions/fetchers';

export const transactionsQueryKeys = createQueryKeys('transactions', {
  list: () => {
    return {
      queryKey: [{}],
      queryFn: () => fetchTransactions(),
    };
  },
});
