import { isPrismaException } from '@/common/is-prisma-exception/is-prisma-exception';
import { TProjectIds } from '@/types';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CollectionFlowUtilityService {
  constructor(
    @Inject(forwardRef(() => WorkflowService))
    protected readonly workflowService: WorkflowService,
    protected readonly uiDefinitionService: UiDefinitionService,
  ) {}

  async isCollectionFlowStateSupported(workflowId: string, projectIds: TProjectIds) {
    const workflowDefinition = await this.workflowService.getWorkflowByIdWithRelations(
      workflowId,
      projectIds,
    );

    try {
      await this.uiDefinitionService.getByWorkflowDefinitionId(
        workflowDefinition.workflowDefinitionId,
        'collection_flow',
        projectIds,
      );

      return true;
    } catch (error) {
      if (isPrismaException(error) && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  }
}
