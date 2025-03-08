import { BadRequestException } from '@nestjs/common';

export const getEntityId = (data: { businessId?: string; endUserId?: string }) => {
  if (data.businessId) {
    return data.businessId;
  }

  if (data.endUserId) {
    return data.endUserId;
  }

  throw new BadRequestException('Business or end user id is required');
};
