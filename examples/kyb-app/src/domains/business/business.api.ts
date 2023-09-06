import { request } from '@app/common/utils/request';
import { UpdateBusinessDto } from '@app/domains/business/types';
import { AnyObject } from '@ballerine/ui';
import { GetBusinessInformationDto, TBusinessInformation } from './types';

export const updateBusiness = async (dto: UpdateBusinessDto) => {
  const { businessId, ...restDto } = dto;

  const result = await request
    .put(`external/businesses/${businessId}`, {
      json: {
        shareholderStructure: [],
        ...restDto,
      },
    })
    .json<AnyObject>();

  return result;
};

export const fetchBusinessInformation = async ({
  registrationNumber,
  jurisdictionCode,
}: GetBusinessInformationDto): Promise<TBusinessInformation> => {
  const result = await request
    .get(`collection-flow/business/business-information`, {
      searchParams: { jurisdictionCode, registrationNumber },
    })
    .json<TBusinessInformation>();

  return result;
};
