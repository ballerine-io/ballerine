import { Prisma, WorkflowRuntimeDataStatus } from '@prisma/client';
import { TDocumentDecisionStatus } from '@/workflow/types';

type Filters = {
  assigneeId?: (string | null)[];
  status?: WorkflowRuntimeDataStatus[];
  tasksStatus?: Array<TDocumentDecisionStatus>;
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

  if (filters.tasksStatus) {
    where.tasksStatus = {
      in: filters.tasksStatus,
    };
  }

  return where;
};
