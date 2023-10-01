import { Prisma, PrismaClient } from '@prisma/client';
import { PersonalInfoPage } from '../../../src/ui-definition/utils/collection-flow/1-personal-info-page';
import { BusinessInfoPage } from '../../../src/ui-definition/utils/collection-flow/2-business-info-page';
import { defintion } from '../../../src/ui-definition/utils/collection-flow/defintion-logic';
import { ContactsPage } from '../../../src/ui-definition/utils/collection-flow/5-contacts-page';
import { BusinessAddressInfoPage } from '../../../src/ui-definition/utils/collection-flow/3-business-address-info-page';
import { DirectorsAndUbosPage } from '../../../src/ui-definition/utils/collection-flow/4-directors-and-ubos';

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
      ],
    },
    definition: defintion,
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
