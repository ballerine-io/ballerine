import { PrismaClient } from '@prisma/client';

export async function fliterQuery() {
  const client = new PrismaClient();

  const res = await client.endUser.findMany({
    where: {
      workflowRuntimeData: {
        some: {
          workflowDefinition: {
            is: {
              id: 'risk-score-improvement-dev',
            },
          },
        },
      },
    },
    select: {
      id: true,
      email: true,
      phone: true,
      jsonData: true,
      lastName: true,
      avatarUrl: true,
      createdAt: true,
      firstName: true,
      updatedAt: true,
      dateOfBirth: true,
      endUserType: true,
      stateReason: true,
      approvalState: true,
      correlationId: true,
      additionalInfo: true,
      verificationId: true,
      workflowRuntimeData: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          workflowDefinition: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(res);

  client.$disconnect();
}

fliterQuery();
