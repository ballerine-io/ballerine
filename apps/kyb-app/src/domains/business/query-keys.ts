import { fetchBusinessInformation } from '@/domains/business/business.api';
import { GetBusinessInformationDto } from '@/domains/business/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const businessQueryKeys = createQueryKeys('business', {
  getBusinessInformation: (query: GetBusinessInformationDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchBusinessInformation(query),
  }),
});
