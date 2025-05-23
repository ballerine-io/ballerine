import { Prisma } from '@prisma/client';
import { CompanyInfoPage } from './1-company-info-page';
import { BusinessAddressInfoPage } from './2-business-address-info-page';
import { CompanyActivityPage } from './3-company-activity';
import { BankInformationPage } from './4-bank-information';
import { CompanyOwnershipPage } from './5-company-ownership';
import { CompanyDocumentsPage } from './6-company-documents';
import { definition } from './definition-logic';
import locales from '../locales';

export const composeUiDefinition = (
  workflowDefinitionId: string,
): Pick<
  Prisma.UiDefinitionUncheckedCreateInput,
  'uiContext' | 'uiSchema' | 'definition' | 'workflowDefinitionId' | 'version' | 'locales'
> => {
  return {
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
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
    locales,
    version: 2,
  };
};
