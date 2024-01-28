import { Prisma, WorkflowRuntimeDataStatus } from '@prisma/client';

type Filters = {
  assigneeId?: Array<string | null>;
  status?: WorkflowRuntimeDataStatus[];
};

export const toPrismaWhere = (filters: Filters): Prisma.WorkflowRuntimeDataWhereInput => {
  const where: Prisma.WorkflowRuntimeDataWhereInput = {};

  if (filters.assigneeId) {
    where.OR = [
      {
        assigneeId: {
          in: filters.assigneeId.filter((id): id is string => id !== null),
        },
      },
      {
        assigneeId: filters.assigneeId.includes(null) ? null : undefined,
      },
    ];
  }

  if (filters.status) {
    where.status = {
      in: filters.status,
    };
  }

  return where;
};
