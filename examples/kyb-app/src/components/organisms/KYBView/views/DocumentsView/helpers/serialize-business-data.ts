import { DocumentsContext } from '@app/components/organisms/KYBView/types';
import { UpdateBusinessDto } from '@app/domains/business';

export const serializeBusinessData = (
  context: DocumentsContext,
  businessId: string,
): UpdateBusinessDto => {
  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: context.information.registrationNumber,
    address: context.address.address,
    website: context.information.website,
  };

  return dto;
};
