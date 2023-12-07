import { definition } from './defintion-logic';
import { PersonalInfoPage } from './1-personal-info-page';
import { CompanyInfoPage } from './2-company-info-page';
import { BusinessAddressInfoPage } from './3-business-address-info-page';
import { CompanyActivityPage } from './4-company-activity';
import { BankInformationPage } from './5-bank-information';
import { CompanyOwnershipPage } from './6-company-ownership';
import { CompanyDocumentsPage } from './7-company-documents';
import { Prisma } from '@prisma/client';

export const composeUiDefinition = (
  workflowDefinitionId: string,
): Pick<
  Prisma.UiDefinitionUncheckedCreateInput,
  'uiContext' | 'uiSchema' | 'definition' | 'workflowDefinitionId'
> => {
  return {
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
        PersonalInfoPage,
        CompanyInfoPage,
        BusinessAddressInfoPage,
        CompanyActivityPage,
        BankInformationPage,
        CompanyOwnershipPage,
        CompanyDocumentsPage,
      ],
    },
    definition: definition,
    workflowDefinitionId: workflowDefinitionId,
  };
};
