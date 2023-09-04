import { Customer, PrismaClient } from '@prisma/client';

export async function createProject(client: PrismaClient, customer: Customer, id: string) {
  return client.project.create({
    data: {
      id: `project-${id}`,
      name: `Project ${id}`,
      customerId: customer.id,
    },
  });
}
