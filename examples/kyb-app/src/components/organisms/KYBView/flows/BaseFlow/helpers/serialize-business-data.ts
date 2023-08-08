import { HeadquartersContext } from '@app/components/organisms/KYBView/views/HeadquartersView/types';
import { UpdateBusinessDto } from '@app/domains/business';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const buildCompanyAddress = (headquarters: HeadquartersContext): string => {
  const { country, state, postalCode, street, city } = headquarters;

  const addressList = [postalCode, street, city, state, country].filter(Boolean);

  return addressList.join(',');
};

export const serializeBusinessData = (
  context: WorkflowFlowData,
  businessId: string,
): UpdateBusinessDto => {
  const { companyInformation, companyActivity, headquarters } = context.flowData;

  const dto: UpdateBusinessDto = {
    businessId,
    registrationNumber: companyInformation.registrationNumber,
    address: buildCompanyAddress(headquarters),
    website: companyActivity.website,
  };

  return dto;
};
