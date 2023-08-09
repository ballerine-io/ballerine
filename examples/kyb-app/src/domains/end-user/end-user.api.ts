import { request } from '@app/common/utils/request';
import { CreateEndUserDto, CreateEndUserResponse } from '@app/domains/end-user/types';

export const createEndUser = async (dto: CreateEndUserDto): Promise<CreateEndUserResponse> => {
  const { additionalInformation, ...restFields } = dto;

  const result = await request
    .post('external/end-users/create-with-business', {
      json: {
        ...restFields,
        additionalInfo: additionalInformation,
      },
    })
    .json<CreateEndUserResponse>();

  return result;
};
