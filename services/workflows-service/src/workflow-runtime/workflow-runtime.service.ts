import { WorkflowRuntimeDataRepository } from '@/workflow-runtime/workflow-runtime-data.repository';
import { ListWorkflowsRuntimeParams } from '@/workflow-runtime/workflow-runtime.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowRuntimeService {
  constructor(private readonly repository: WorkflowRuntimeDataRepository) {}

  async listWorkflowsRuntime({ page, size, status }: ListWorkflowsRuntimeParams = {}) {
    const [workflowsRuntimeCount, workflowsRuntime] = await Promise.all([
      this.repository.count(),
      this.repository.findMany({
        skip: page && size ? (page - 1) * size : undefined,
        take: size,
        where: {
          ...(status ? { status } : undefined),
        },
      }),
    ]);

    return {
      results: workflowsRuntime,
      totalPages: size ? Math.max(Math.ceil(workflowsRuntimeCount / size)) : null,
      totalItems: workflowsRuntimeCount,
    };
  }
}
