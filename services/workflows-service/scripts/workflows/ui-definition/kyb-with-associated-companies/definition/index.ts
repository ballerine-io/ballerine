import { composeChildAssociatedCompanyDefinition } from './compose-child-associated-company-definition';
import { PrismaClient } from '@prisma/client';
import { composeKybWithAssociatedCompaniesDefinition } from './compose-kyb-with-associated-companies-definition';
import { composeKycChildWorkflowDefinition } from './compose-kyc-child-workflow-definition';

export const generateKybWithChildWorkflowDefinition = async (
  client: PrismaClient,
  projectId: string,
) => {
  const kybAssociatedChildDefinition = await client.workflowDefinition.create({
    data: composeChildAssociatedCompanyDefinition({
      definitionId: 'associated_company_child_workflow',
      definitionName: 'associated_company_child_workflow',
      projectId: projectId,
    }),
  });

  const kycChildDefinition = await client.workflowDefinition.create({
    data: composeKycChildWorkflowDefinition({
      definitionId: 'kyc_child_workflow',
      definitionName: 'kyc_child_workflow',
      projectId: projectId,
    }),
  });

  const kybWithAssociatedParentDefinition = await client.workflowDefinition.create({
    data: composeKybWithAssociatedCompaniesDefinition({
      definitionId: 'kyb_with_associated_companies_example',
      definitionName: 'kyb_with_associated_companies_example',
      projectId: projectId,
      kycChildWorkflowDefinitionId: kycChildDefinition.id,
      kybChildWorkflowDefinitionId: kybAssociatedChildDefinition.id,
    }),
  });

  return {
    parentKybDefinition: kybWithAssociatedParentDefinition,
    kybAssociatedChildDefinition,
    kycChildDefinition,
  };
};
