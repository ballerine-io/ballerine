import { Prisma, PrismaClient } from '@prisma/client';
import { PersonalInfoPage } from '../../../src/ui-definition/utils/collection-flow/1-personal-info-page';
import { BusinessInfoPage } from '../../../src/ui-definition/utils/collection-flow/2-business-info-page';
import { definition } from '../../../src/ui-definition/utils/collection-flow/defintion-logic';
import { ContactsPage } from '../../../src/ui-definition/utils/collection-flow/5-contacts-page';
import { BusinessAddressInfoPage } from '../../../src/ui-definition/utils/collection-flow/3-business-address-info-page';
import { DirectorsAndUbosPage } from '../../../src/ui-definition/utils/collection-flow/4-directors-and-ubos';
import { BankingDetailsPage } from '../../../src/ui-definition/utils/collection-flow/6-banking-details';
import { StoreInfoPage } from '../../../src/ui-definition/utils/collection-flow/7-store-info';
<<<<<<< Updated upstream
import { WebsiteBasicRequirement } from '../../../src/ui-definition/utils/collection-flow/8-website-basic-requirement';
import { ProcessingDetails } from '../../../src/ui-definition/utils/collection-flow/9-process-details';
=======
>>>>>>> Stashed changes

export const uiKybParentUiSchema = (workflowDefinitionId: string) =>
  ({
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
        PersonalInfoPage,
        BusinessInfoPage,
        BusinessAddressInfoPage,
        DirectorsAndUbosPage,
        ContactsPage,
        BankingDetailsPage,
        StoreInfoPage,
<<<<<<< Updated upstream
        WebsiteBasicRequirement,
        ProcessingDetails,
=======
>>>>>>> Stashed changes
      ],
    },
    definition: definition,
    workflowDefinitionId: workflowDefinitionId,
  } as const satisfies Prisma.UiDefinitionUncheckedCreateInput);

export const generateDynamicUiTest = async (
  prismaClient: PrismaClient,
  workflowDefinitionId: string,
  projectId?: string | null,
) => {
  return await prismaClient.uiDefinition.create({
    data: { ...uiKybParentUiSchema(workflowDefinitionId), ...{ projectId: projectId } },
  });
};
