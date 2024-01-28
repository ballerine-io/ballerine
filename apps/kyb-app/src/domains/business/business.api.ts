import { request } from '@/common/utils/request';
import { GetBusinessInformationDto, TBusinessInformation } from './types';

export const fetchBusinessInformation = async ({
  registrationNumber,
  jurisdictionCode,
}: GetBusinessInformationDto): Promise<TBusinessInformation> => {
  return await request
    .get(`collection-flow/business/business-information`, {
      searchParams: { jurisdictionCode, registrationNumber },
    })
    .json<TBusinessInformation>();
};
