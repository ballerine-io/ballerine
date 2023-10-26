import { Customer, PrismaClient } from '@prisma/client';

export async function createProject(client: PrismaClient, customer: Customer, id: string) {
  return client.project.upsert({
    where: {
      id: `project-${id}`,
    },
    update: {},
    create: {
      id: `project-${id}`,
      name: `Project ${id}`,
      customerId: customer.id,
    },
  });
}
