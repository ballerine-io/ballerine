import { fetchBusinessInformation } from '@app/domains/business/business.api';
import { GetBusinessInformationDto } from '@app/domains/business/types';
import { createQueryKeys } from '@lukemorales/query-key-factory';

export const businessQueryKeys = createQueryKeys('business', {
  getBusinessInformation: (query: GetBusinessInformationDto) => ({
    queryKey: [{ query }],
    queryFn: () => fetchBusinessInformation(query),
  }),
});
