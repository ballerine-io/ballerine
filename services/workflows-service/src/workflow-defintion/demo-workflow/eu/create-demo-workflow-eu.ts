import { Prisma, PrismaClient } from '@prisma/client';
import { generateWorkflowDefinition } from './kyb-workflow-definition';
import { composeUiDefinition } from './ui-definition/compose-ui-definition';
import { generateBusinessesFilter } from './generate-businesses-filter';

export const upsertDemoEuKybFlow = async (customerId: string) => {
  const prisma = new PrismaClient();

  try {
    return await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
      console.log(`Upserting EU KYB demo flow for customer: ${customerId}`);

      try {
        const customerProject = await transaction.project.findFirst({
          where: {
            customerId,
          },
        });

        if (!customerProject) {
          throw new Error(`No project found for customer: ${customerId}`);
        }

        const projectId = customerProject.id;
        console.log(`Using project: ${projectId}`);

        const customer = await transaction.customer.findUnique({
          where: {
            id: customerId,
          },
        });

        if (!customer) {
          throw new Error(`Customer not found with ID: ${customerId}`);
        }

        const updatedConfig = {
          ...(customer.config as Record<string, unknown>),
          isDemoKybEnabled: true,
        };

        const updatedCustomer = await transaction.customer
          .update({
            where: {
              id: customerId,
            },
            data: {
              config: updatedConfig,
            },
          })
          .catch(error => {
            throw new Error(`Failed to update customer config: ${error.message}`);
          });

        console.log(`Updated customer config for ${updatedCustomer.name}`);

        const workflowDefinitionId = `${customerId}_kyb_demo_eu`;
        const workflowName = 'KYB Onboarding Demo - EU';

        console.log(`Upserting workflow definition with ID: ${workflowDefinitionId}`);

        const kybDemoEuDefinition = generateWorkflowDefinition({
          id: workflowDefinitionId,
          name: workflowName,
          projectId,
          crossEnvKey: workflowDefinitionId,
          withQualityControl: false,
          config: {
            disableVideoGuide: true,
            disableAiSummary: true,
          },
        });

        const existingWorkflowDefinition = await transaction.workflowDefinition
          .findUnique({
            where: {
              id: workflowDefinitionId,
            },
          })
          .catch(error => {
            throw new Error(`Failed to check existing workflow definition: ${error.message}`);
          });

        let workflowDefinition;

        if (existingWorkflowDefinition) {
          workflowDefinition = await transaction.workflowDefinition
            .update({
              where: {
                id: workflowDefinitionId,
              },
              data: {
                name: kybDemoEuDefinition.name,
                version: kybDemoEuDefinition.version,
                definitionType: kybDemoEuDefinition.definitionType,
                definition: kybDemoEuDefinition.definition,
                extensions: kybDemoEuDefinition.extensions,
                config: kybDemoEuDefinition.config,
                crossEnvKey: kybDemoEuDefinition.crossEnvKey,
                contextSchema: kybDemoEuDefinition.contextSchema,
              },
            })
            .catch(error => {
              throw new Error(`Failed to update workflow definition: ${error.message}`);
            });
          console.log(`Workflow definition updated: ${workflowDefinition.id}`);
        } else {
          workflowDefinition = await transaction.workflowDefinition
            .create({
              data: kybDemoEuDefinition,
            })
            .catch(error => {
              throw new Error(`Failed to create workflow definition: ${error.message}`);
            });
          console.log(`Workflow definition created: ${workflowDefinition.id}`);
        }

        const uiDefinition = composeUiDefinition(workflowDefinitionId);
        const uiDefinitionId = `${customerId}_kyb_demo_eu_ui_definition`;

        console.log(`Upserting UI definition for workflow: ${workflowDefinitionId}`);

        const existingUiDefinition = await transaction.uiDefinition
          .findUnique({
            where: {
              id: uiDefinitionId,
            },
          })
          .catch(error => {
            throw new Error(`Failed to check existing UI definition: ${error.message}`);
          });

        let createdUiDefinition;

        if (existingUiDefinition) {
          createdUiDefinition = await transaction.uiDefinition
            .update({
              where: {
                id: uiDefinitionId,
              },
              data: {
                name: workflowName,
                uiContext: uiDefinition.uiContext,
                uiSchema: uiDefinition.uiSchema,
                definition: uiDefinition.definition,
                workflowDefinitionId: uiDefinition.workflowDefinitionId,
                locales: uiDefinition.locales,
                version: 2,
              },
            })
            .catch(error => {
              throw new Error(`Failed to update UI definition: ${error.message}`);
            });
          console.log(`UI definition updated: ${createdUiDefinition.id}`);
        } else {
          createdUiDefinition = await transaction.uiDefinition
            .create({
              data: {
                id: uiDefinitionId,
                name: workflowName,
                projectId,
                uiContext: uiDefinition.uiContext,
                uiSchema: uiDefinition.uiSchema,
                definition: uiDefinition.definition,
                workflowDefinitionId: uiDefinition.workflowDefinitionId,
                locales: uiDefinition.locales,
                crossEnvKey: workflowDefinitionId,
                version: 2,
              },
            })
            .catch(error => {
              throw new Error(`Failed to create UI definition: ${error.message}`);
            });
          console.log(`UI definition created: ${createdUiDefinition.id}`);
        }

        console.log(`Upserting filter for workflow: ${workflowDefinitionId}`);

        const filterData = generateBusinessesFilter({
          filterName: workflowName,
          definitionId: workflowDefinitionId,
          projectId,
        });

        const filterId = `${customerId}_kyb_demo_eu_filter`;

        const existingFilter = await transaction.filter
          .findFirst({
            where: {
              id: filterId,
            },
          })
          .catch(error => {
            throw new Error(`Failed to check existing filter: ${error.message}`);
          });

        let createdFilter;

        if (existingFilter) {
          createdFilter = await transaction.filter
            .update({
              where: {
                id: existingFilter.id,
              },
              data: {
                name: filterData.name,
                query: filterData.query,
              },
            })
            .catch(error => {
              throw new Error(`Failed to update filter: ${error.message}`);
            });
          console.log(`Filter updated: ${createdFilter.id}`);
        } else {
          createdFilter = await transaction.filter
            .create({
              data: {
                ...filterData,
                id: filterId,
              },
            })
            .catch(error => {
              throw new Error(`Failed to create filter: ${error.message}`);
            });
          console.log(`Filter created: ${createdFilter.id}`);
        }

        console.log(`EU KYB demo flow upserted successfully for customer: ${customerId}`);

        return {
          workflowDefinitionId,
          uiDefinitionId: createdUiDefinition.id,
          filterId: createdFilter.id,
        };
      } catch (error) {
        console.error(`Error in transaction for customer ${customerId}:`, error);
        throw error;
      }
    });
  } catch (error) {
    console.error(`Failed to upsert EU KYB demo flow for customer ${customerId}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect().catch(error => {
      console.error('Failed to disconnect from Prisma client:', error);
    });
  }
};
