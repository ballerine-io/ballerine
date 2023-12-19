import { Prisma } from '@prisma/client';

import { definition } from './associated-ui-definition';
import { CompanyInfoPage } from '../../../kyb-parent-dynamic-example/pages/2-company-info-page';
import { BusinessAddressInfoPage } from '../../../kyb-parent-dynamic-example/pages/3-business-address-info-page';
import { AssociatedCompanyDocumentsPage } from './3-associated-company-documents';

export const composeAssociatedUiDefinition = (workflowDefinitionId: string, projectId: string) => {
  return {
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
        { ...CompanyInfoPage, number: 1 },
        { ...BusinessAddressInfoPage, number: 2 },
        AssociatedCompanyDocumentsPage,
      ],
    },
    definition: definition,
    workflowDefinitionId: workflowDefinitionId,
    projectId: projectId,
  } satisfies Prisma.UiDefinitionUncheckedCreateInput;
};
