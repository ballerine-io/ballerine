import { Customer, Prisma, PrismaClient, WorkflowRuntimeDataStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import {
  CommonWorkflowStates,
  defaultContextSchema,
  everyDocumentDecisionStatus,
  someDocumentDecisionStatus,
  StateTags,
} from '@ballerine/common';
import { generateBaseTaskLevelStates } from './workflows/generate-base-task-level-states';

async function migrate() {
  dotenv.config();
  console.info('migrate database...');
  const prisma = new PrismaClient();
  const customer = await createCustomer(prisma);
  const projectId = customer.projects[0]!.id;
  await prisma.business.updateMany({ where: { projectId: null }, data: { projectId: projectId } });
  await prisma.endUser.updateMany({ where: { projectId: null }, data: { projectId: projectId } });
  await prisma.workflowRuntimeData.updateMany({
    where: { projectId: null },
    data: { projectId: projectId },
  });
  await prisma.file.updateMany({ where: { projectId: null }, data: { projectId: projectId } });
  await prisma.filter.updateMany({ where: { projectId: null }, data: { projectId: projectId } });
  const users = await prisma.user.findMany({});
  await Promise.all(
    users.map(user => {
      return prisma.user.update({
        where: { id: user.id },
        data: {
          userToProjects: {
            createMany: {
              data: [{ projectId: projectId }],
            },
          },
        },
      });
    }),
  );
  const filters = await prisma.filter.findMany({});
  await Promise.all(
    filters.map(filter => {
      let query = filter.query as Record<string, any>;
      const workflowDefinition = query.select.workflowDefinition;
      const workflowDefinitionSelect = workflowDefinition.select;
      query = {
        ...query,
        select: {
          ...query.select,
          state: true,
          tags: true,
          workflowDefinition: {
            ...workflowDefinition,
            select: {
              ...workflowDefinitionSelect,
              definition: true,
            },
          },
        },
      };
      return prisma.filter.update({ data: { query: query }, where: { id: filter.id } });
    }),
  );
  const workflowDefintions = await prisma.workflowDefinition.findMany({});
  await Promise.all(
    workflowDefintions.map(async workflowDefinition => {
      return prisma.workflowDefinition.update({
        where: { id: workflowDefinition.id },
        data: {
          contextSchema: { type: 'json-schema', schema: defaultContextSchema },
          projectId: projectId,
          config: {
            isLegacyReject: true,
            workflowLevelResolution: false,
          },
          definition: {
            ...(workflowDefinition.definition as Record<string, unknown>),
            states: generateBaseTaskLevelStates(),
            initial: CommonWorkflowStates.MANUAL_REVIEW,
          },
        },
      });
    }),
  );

  await initiateAllRuntimeUpdateStates(prisma);
  console.info('migration succeeded');
}
const createCustomer = async (prisma: PrismaClient, projectName = 'default') => {
  const customer: Prisma.CustomerCreateInput = {
    name: 'fido',
    displayName: 'Fido',
    logoImageUri: 'https://blrn-cdn-prod.s3.eu-central-1.amazonaws.com/assets/fido_logo.svg',
    customerStatus: 'active',
    authenticationConfiguration: {
      apiType: 'API_KEY',
      authValue: process.env.API_KEY,
      isValid: true,
    },
  };
  if (projectName) {
    customer.projects = {
      create: { name: projectName },
    };
  }
  const createdCustomer = (await prisma.customer.create({
    data: customer,
    select: {
      id: true,
      projects: { select: { id: true } },
    },
  })) as Customer & { projects: { id: string }[] };
  return createdCustomer;
};

const initiateAllRuntimeUpdateStates = async (
  prisma: PrismaClient,
  batchSize = 1000,
  offset = 0,
): Promise<void> => {
  const workflowRuntimes = await prisma.workflowRuntimeData.findMany({
    skip: offset,
    take: batchSize,
  });

  if (workflowRuntimes.length === 0) {
    return;
  }

  for (const workflowRuntime of workflowRuntimes) {
    const { state, status, tags } = calculateCurrentWorkflowState(workflowRuntime);

    await prisma.workflowRuntimeData.update({
      data: { tags, state, status },
      where: { id: workflowRuntime.id },
    });
  }

  return initiateAllRuntimeUpdateStates(prisma, batchSize, offset + batchSize);
};

const calculateCurrentWorkflowState = (
  workflowRuntime: any,
): { state: string; status: WorkflowRuntimeDataStatus; tags: Array<string> | undefined } => {
  const documents = workflowRuntime.context?.documents;
  const status = documents?.every((document: any) => document.decision) ? 'completed' : 'active';
  let state = undefined;

  state ||= someDocumentDecisionStatus(documents, 'rejected') ? 'rejected' : undefined;
  state ||= everyDocumentDecisionStatus(documents, 'revision') ? 'revision' : undefined;
  state ||= everyDocumentDecisionStatus(documents, 'approved') ? 'approved' : undefined;
  state ||= CommonWorkflowStates.MANUAL_REVIEW;

  const tags = calculateStateTag(state);

  return { state, status, tags };
};

const calculateStateTag = (state: string | null) => {
  const foundTag: string | undefined = StateTags.find(tag => tag === state);
  if (foundTag) {
    return [foundTag];
  }
};
migrate().catch(error => {
  console.error(error);
  process.exit(1);
});
