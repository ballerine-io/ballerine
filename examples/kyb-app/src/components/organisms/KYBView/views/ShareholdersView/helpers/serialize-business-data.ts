import { KYBContext } from '@app/components/organisms/KYBView/types';
import { UpdateBusinessDto } from '@app/domains/business';

export const serializeBusinessData = (
  context: KYBContext,
  businessId: string,
): UpdateBusinessDto => {
  const { businessAddress, businessInformation } = context.flowData;

  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: businessInformation.registrationNumber,
    address: businessAddress.address,
    website: businessInformation.website,
  };

  return dto;
};
