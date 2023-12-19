import { composeChildAssociatedCompanyDefinition } from './compose-child-associated-company-definition';
import { PrismaClient } from '@prisma/client';
import { composeKybWithAssociatedCompaniesDefinition } from './compose-kyb-with-associated-companies-definition';
import { composeKycChildWorkflowDefinition } from './compose-kyc-child-workflow-definition';

export const generateKybWithChildWorkflowDefinition = async (
  client: PrismaClient,
  projectId: string,
) => {
  const kycDefinition = await client.workflowDefinition.create({
    data: composeChildAssociatedCompanyDefinition({
      definitionId: 'associated_company_child_workflow',
      definitionName: 'associated_company_child_workflow',
      projectId: projectId,
    }),
  });

  const kybAsocciatedChildDefinition = await client.workflowDefinition.create({
    data: composeKycChildWorkflowDefinition({
      definitionId: 'kyc_child_workflow',
      definitionName: 'kyc_child_workflow',
      projectId: projectId,
    }),
  });

  const kybWithAssociatedParentDefinition = await client.workflowDefinition.create({
    data: composeKybWithAssociatedCompaniesDefinition({
      definitionId: 'kyb_with_associated_companies',
      definitionName: 'kyb_with_associated_companies',
      projectId: projectId,
      kycChildWorkflowDefinitionId: kycDefinition.id,
      kybChildWorkflowDefinitionId: kybAsocciatedChildDefinition.id,
    }),
  });

  return {
    parentKybDefinition: kybWithAssociatedParentDefinition,
    kybAssociatedDefinition: kybAsocciatedChildDefinition,
    kycDefinition,
  };
};
