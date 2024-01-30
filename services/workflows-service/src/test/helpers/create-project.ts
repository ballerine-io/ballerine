import { Customer, PrismaClient } from '@prisma/client';

export const createProject = async (client: PrismaClient, customer: Customer, id: string) =>
  client.project.upsert({
    where: {
      id: `project-${id}`,
    },
    update: {},
    create: {
      id: `${id}`,
      name: `Project ${id}`,
      customerId: customer.id,
    },
  });
