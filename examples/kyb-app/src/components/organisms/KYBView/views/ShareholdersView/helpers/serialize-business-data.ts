import { KYBContext } from '@app/components/organisms/KYBView/types';
import { UpdateBusinessDto } from '@app/domains/business';

export const serializeBusinessData = (
  context: KYBContext,
  businessId: string,
): UpdateBusinessDto => {
  console.log('context', context);

  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: context.businessInformation.registrationNumber,
    address: context.businessAddress.address,
    website: context.businessInformation.website,
  };

  return dto;
};
