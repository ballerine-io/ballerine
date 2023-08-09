import { FindLastActiveFlowParams } from '@/collection-flow/repository/types';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import * as common from '@nestjs/common';
import { WorkflowRuntimeData } from '@prisma/client';

@common.Injectable()
export class CollectionFlowRepository {
  constructor(private readonly workflowRuntimeRepository: WorkflowRuntimeDataRepository) {}

  async findLastActive({
    workflowDefinitionId,
    businessId,
  }: FindLastActiveFlowParams): Promise<WorkflowRuntimeData | null> {
    //NOTE: This logic of picking last active workflow is not final and will be changed
    const latestWorkflowRuntimeData = await this.workflowRuntimeRepository.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      where: {
        businessId,
        workflowDefinitionId,
      },
    });

    return latestWorkflowRuntimeData
      ? (latestWorkflowRuntimeData.at(-1) as WorkflowRuntimeData)
      : null;
  }
}
