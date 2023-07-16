import { request } from '@app/common/utils/request';
import { CreateEndUserDto, CreateEndUserResponse } from '@app/domains/end-user/types';

export const createEndUser = async (dto: CreateEndUserDto): Promise<CreateEndUserResponse> => {
  const result = await request
    .post('external/end-users/create-with-business', { json: dto })
    .json<CreateEndUserResponse>();

  return result;
};
