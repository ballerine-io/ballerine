import { BusinessData, TUser } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { buildCompanyAddress } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-business-data';
import { traverseObjectAndPickValue } from '@app/utils/traverse-object-and-pick-value';

export const selectBusinessData = ({ flowData }: WorkflowFlowData, user: TUser): BusinessData => {
  const businessData: BusinessData = {
    industry: traverseObjectAndPickValue('industry', flowData, ''),
    website: traverseObjectAndPickValue('website', flowData, ''),
    legalForm: traverseObjectAndPickValue('companyType', flowData, ''),
    companyName: traverseObjectAndPickValue('companyName', flowData, ''),
    registrationNumber: traverseObjectAndPickValue('registrationNumber', flowData, ''),
    country: '',
    countryOfIncorporation: traverseObjectAndPickValue('companyCountry', flowData, ''),
    dateOfIncorporation: traverseObjectAndPickValue('registrationDate', flowData, ''),
    address: buildCompanyAddress(traverseObjectAndPickValue('headquarters', flowData, {}) as any),
    phoneNumber: '',
    email: user.email,
    taxIdentificationNumber: '',
    vatNumber: traverseObjectAndPickValue('vat', flowData, ''),
  };

  return businessData;
};
