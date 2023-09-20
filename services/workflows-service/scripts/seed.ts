import { Customer, Prisma, PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { defaultContextSchema, StateTags } from '@ballerine/common';

async function migrate() {
  dotenv.config();
  console.info('migrate database...');
  const prisma = new PrismaClient();
  const customer = await createCustomer(prisma);
  const projectId = customer.projects[0].id as string;
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
          contextSchema: defaultContextSchema,
        },
      });
    }),
  );

  await initiateAllRuntimeTags(prisma);
  console.info('migration succeeded');
}
const createCustomer = async (prisma: PrismaClient, projectName: string = 'default') => {
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

const initiateAllRuntimeTags = async (prisma: PrismaClient, batchSize = 1000, offset = 0) => {
  const workflowRuntimes = await prisma.workflowRuntimeData.findMany({
    skip: offset,
    take: batchSize,
  });

  if (workflowRuntimes.length === 0) {
    return;
  }

  for (const workflowRuntime of workflowRuntimes) {
    const tags = calculateStateTag(workflowRuntime.state);
    if (!tags) {
      continue;
    }

    await prisma.workflowRuntimeData.update({
      data: { tags: tags },
      where: { id: workflowRuntime.id },
    });
  }

  return initiateAllRuntimeTags(prisma, batchSize, offset + batchSize);
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
