import { request } from '@app/common/utils/request';
import { UpdateBusinessDto } from '@app/domains/business/types';
import { AnyObject } from '@ballerine/ui';

export const updateBusiness = async (dto: UpdateBusinessDto) => {
  const { businessId, ...restDto } = dto;

  const result = await request
    .put(`external/businesses/${businessId}`, { json: restDto })
    .json<AnyObject>();

  return result;
};
