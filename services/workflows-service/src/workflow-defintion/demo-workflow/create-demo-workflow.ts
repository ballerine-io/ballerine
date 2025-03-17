import { Customer, Prisma, PrismaClient, Project } from '@prisma/client';
import { composeChildAssociatedCompanyDefinition } from './compose-child-associated-company-definition';
import { generateWorkflowDefinitionWithAssociated } from './workflow-definition-with-associated';
import { generateBusinessesFilter } from './generate-businesses-filter';
import { randomUUID } from 'crypto';
import { PrismaTransactionClient } from '@/types';
import { kycEmailSessionDefinition } from './generate-kyc-email-process';
import { seedTransactionsAlerts } from '../../../scripts/alerts/generate-alerts';
import { generateTransactions } from '../../../scripts/alerts/generate-transactions';
import { getMockWorkflowContext } from './workflow-context-mock-data';
import { generateKycChildWorkflowMockData } from './genreate-kyc-child-workflow-mock-data';
import { generateDocumentPageFactory } from './generate-document-page-factory';

const getKybWorkflowContexts = async ({
  client,
  projectId,
  customerName,
  workflowOverrides,
}: {
  client: PrismaTransactionClient | PrismaClient;
  projectId: string;
  customerName: string;
  workflowOverrides?: Array<{
    webPresenceReportId?: string;
  }>;
}) => {
  const generateDocumentPage = generateDocumentPageFactory({
    client,
    projectId,
  });

  return await getMockWorkflowContext(customerName, generateDocumentPage, workflowOverrides);
};

const generateBusiness = ({
  projectId,
  workflowDefinitionId,
  context,
  userId,
}: {
  projectId: string;
  workflowDefinitionId: string;
  context: Record<string, any>;
  userId: string;
}) => {
  const id = randomUUID();

  return {
    id,
    companyName: 'GreenTech Solutions Ltd.',
    workflowRuntimeData: {
      create: {
        workflowDefinitionId,
        state: 'manual_review',
        context: {
          ...context,
          ballerineEntityId: id,
        },
        workflowDefinitionVersion: 1,
        projectId,
        config: {
          example: true,
        },
        tags: ['manual_review'],
        assigneeId: userId,
        assignedAt: new Date(),
      },
    },
    project: {
      connect: {
        id: projectId,
      },
    },
  } satisfies Prisma.BusinessCreateInput;
};

const generateIndividual = ({
  projectId,
  workflowDefinitionId,
  parentRuntimeDataId,
  context,
}: {
  projectId: string;
  workflowDefinitionId: string;
  parentRuntimeDataId: string;
  context: Record<string, any>;
}) => {
  const id = randomUUID();

  return {
    id,
    firstName: context.entity.data.firstName,
    lastName: context.entity.data.lastName,
    workflowRuntimeData: {
      create: {
        parentRuntimeDataId,
        context: {
          ...context,
          ballerineEntityId: id,
        },
        workflowDefinitionId,
        workflowDefinitionVersion: 1,
        state: 'kyc_manual_review',
        projectId,
        config: {
          language: 'en',
          callbackResult: {
            deliverEvent: 'KYC_DONE',
            transformers: [{ mapping: '{data: @}', transformer: 'jmespath' }],
          },
        },
      },
    },
    project: {
      connect: {
        id: projectId,
      },
    },
  } satisfies Prisma.EndUserCreateInput;
};

type TDemoEnv = {
  customer: Customer;
  project: Project;
  user:
    | undefined
    | {
        id: string;
      };
};

export const createDemoWorkflow = async ({
  customer,
  demoEnv,
  transaction,
  workflowOverrides,
  userId,
}: {
  customer: Customer;
  demoEnv: TDemoEnv;
  transaction: PrismaTransactionClient;
  workflowOverrides?: Array<{
    webPresenceReportId?: string;
  }>;
  userId?: string;
}) => {
  const demoOngoingMonitoringChildAssociatedCompanyDefinition =
    composeChildAssociatedCompanyDefinition({
      definitionId: `${customer.name}_demo_ongoing_monitoring_child_associated_company`,
      definitionName: `${customer.name}_demo_ongoing_monitoring_child_associated_company`,
      projectId: demoEnv.project.id,
    });

  await transaction.workflowDefinition.create({
    data: demoOngoingMonitoringChildAssociatedCompanyDefinition,
  });

  let demoOngoingMonitoringKybDefinition = generateWorkflowDefinitionWithAssociated({
    id: `${customer.name}_demo_ongoing_monitoring_kyb`,
    name: `${customer.name}_demo_ongoing_monitoring_kyb`,
    projectId: demoEnv.project.id,
    crossEnvKey: `${customer.name}_demo_kyb`,
    kybChildWorkflowDefinitionId: demoOngoingMonitoringChildAssociatedCompanyDefinition.id,
  });

  demoOngoingMonitoringKybDefinition = {
    ...demoOngoingMonitoringKybDefinition,
    config: {
      ...demoOngoingMonitoringKybDefinition.config,
      isAssociatedCompanyKybEnabled: false,
      enableManualCreation: false,
    },
  };

  await transaction.workflowDefinition.create({
    data: demoOngoingMonitoringKybDefinition,
  });

  const businessFilter = generateBusinessesFilter({
    filterName: 'Merchant Onboarding',
    definitionId: demoOngoingMonitoringKybDefinition.id,
    projectId: demoEnv.project.id,
  });

  await transaction.filter.create({
    data: businessFilter,
  });

  const kybWorkflowContexts = await getKybWorkflowContexts({
    client: transaction,
    projectId: demoEnv.project.id,
    customerName: customer.name,
    workflowOverrides,
  });
  const kycWorkflowContexts = await generateKycChildWorkflowMockData({
    client: transaction as PrismaClient,
    projectId: demoEnv.project.id,
    customerName: customer.name,
    customer: {
      ...customer,
      id: 'demo-customer-id',
      config: {},
      subscriptions: [],
    },
    demoEnv: {
      ...demoEnv,
      customer: {
        ...demoEnv.customer,
        id: 'demo-customer-id',
      },
    },
  });

  for (const kybWorkflowContext of kybWorkflowContexts) {
    const business = await transaction.business.create({
      data: generateBusiness({
        projectId: demoEnv.project.id,
        workflowDefinitionId: demoOngoingMonitoringKybDefinition.id,
        context: kybWorkflowContext,
        userId: userId ?? '',
      }),
      select: {
        workflowRuntimeData: {
          select: {
            id: true,
          },
        },
      },
    });

    for (const kycWorkflowContext of kycWorkflowContexts) {
      await transaction.endUser.create({
        data: generateIndividual({
          workflowDefinitionId: kycEmailSessionDefinition().id,
          parentRuntimeDataId: business.workflowRuntimeData[0]?.id ?? '',
          context: kycWorkflowContext,
          projectId: demoEnv.project.id,
        }),
      });
    }
  }

  const counterpartyIds = await generateTransactions(transaction, {
    projectId: demoEnv.project.id,
  });

  const businessIds = (
    await transaction.business.findMany({
      where: {
        project: {
          id: demoEnv.project.id,
        },
      },
      select: {
        id: true,
      },
      take: 5,
    })
  ).map(({ id }) => id);

  await seedTransactionsAlerts(transaction, {
    project: demoEnv.project,
    agentUserIds: [demoEnv.user?.id].filter(Boolean),
    businessIds,
    counterpartyIds: counterpartyIds
      .map(
        ({ counterpartyOriginatorId, counterpartyBeneficiaryId }) =>
          counterpartyOriginatorId || counterpartyBeneficiaryId,
      )
      .filter(Boolean),
  });
};
