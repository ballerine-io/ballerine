import { EntityData } from '@app/domains/collection-flow';
import { TCustomer } from '@app/domains/customer';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { getFullCountryNameByCode } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/get-countries-list';

export const selectEntityData = (
  { flowData }: WorkflowFlowData,
  customer: TCustomer,
): EntityData => {
  const entityData: EntityData = {
    website: flowData.companyActivity?.website || '',
    countryOfIncorporation: getFullCountryNameByCode(customer.country) || '',
    companyName: customer.name,
    companyDisplayName: customer.displayName,
    fullAddress: buildCompanyAddress(flowData.headquarters || {}) || '',
    registrationNumber: flowData.companyInformation?.registrationNumber || '',
  };

  return entityData;
};
