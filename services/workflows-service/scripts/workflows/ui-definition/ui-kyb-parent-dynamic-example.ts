import { Prisma, PrismaClient } from '@prisma/client';
import { PersonalInfoPage } from './pages/1-personal-info-page';
import { CompanyInfoPage } from './pages/2-company-info-page';
import { BusinessAddressInfoPage } from './pages/3-business-address-info-page';
import { CompanyOwnershipPage } from './pages/4-company-ownership';
import { CompanyDocumentsPage } from './pages/5-company-documents';
import { definition } from './pages/defintion-logic';

export const uiKybParentUiSchema = (workflowDefinitionId: string, projectId: string) =>
  ({
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
        PersonalInfoPage,
        CompanyInfoPage,
        BusinessAddressInfoPage,
        CompanyOwnershipPage,
        CompanyDocumentsPage,
      ],
    },
    definition: definition,
    workflowDefinitionId: workflowDefinitionId,
    projectId: projectId,
  } as const satisfies Prisma.UiDefinitionUncheckedCreateInput);

export const uiKybParentDynamicExample = async (
  prismaClient: PrismaClient,
  workflowDefinitionId: string,
  projectId: string,
) => {
  return await prismaClient.uiDefinition.create({
    data: uiKybParentUiSchema(workflowDefinitionId, projectId),
  });
};
