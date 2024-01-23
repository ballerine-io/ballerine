import { Prisma, PrismaClient } from '@prisma/client';
import { definition } from './ui-definition/kyb-with-associated-company-ui-def/defintion-logic';
import { PersonalInfoPage } from '../kyb-parent-dynamic-example/pages/1-personal-info-page';
import { CompanyInfoPage } from '../kyb-parent-dynamic-example/pages/2-company-info-page';
import { BusinessAddressInfoPage } from '../kyb-parent-dynamic-example/pages/3-business-address-info-page';
import { CompanyActivityPage } from './ui-definition/kyb-with-associated-company-ui-def/4-company-activity-page';
import { BankInformationPage } from './ui-definition/kyb-with-associated-company-ui-def/5-bank-information';
import { CompanyOwnershipWithAssociatedCPage } from './ui-definition/kyb-with-associated-company-ui-def/6-company-ownership-with-associated';
import { CompanyDocumentsPage } from './ui-definition/kyb-with-associated-company-ui-def/7-company-documents';
import { generateKybWithChildWorkflowDefinition } from './definition';
import { composeAssociatedUiDefinition } from './ui-definition/associated-company-ui-def/compose-associated-ui-definition';

export const uiKybWithAssociatedParentUiSchema = (
  workflowDefinitionId: string,
  projectId: string,
) =>
  ({
    uiContext: 'collection_flow',
    uiSchema: {
      elements: [
        PersonalInfoPage,
        CompanyInfoPage,
        BusinessAddressInfoPage,
        CompanyActivityPage,
        BankInformationPage,
        CompanyOwnershipWithAssociatedCPage,
        CompanyDocumentsPage,
      ],
    },
    definition: definition,
    workflowDefinitionId: workflowDefinitionId,
    projectId: projectId,
  } as const satisfies Prisma.UiDefinitionUncheckedCreateInput);

export const uiKybParentWithAssociatedCompanies = async (
  prismaClient: PrismaClient,
  projectId: string,
) => {
  const { parentKybDefinition, kybAssociatedChildDefinition } =
    await generateKybWithChildWorkflowDefinition(prismaClient, projectId);

  const uiDef = await prismaClient.uiDefinition.create({
    data: uiKybWithAssociatedParentUiSchema(parentKybDefinition.id, projectId),
  });

  const associatedCompanyUiDef = await prismaClient.uiDefinition.create({
    data: composeAssociatedUiDefinition(kybAssociatedChildDefinition.id, projectId),
  });
  return { parentWorkflow: parentKybDefinition, uiDefinition: uiDef };
};
