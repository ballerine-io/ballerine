import { Injectable } from '@nestjs/common';
import { CustomerService } from '@/customer/customer.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { Prisma } from '@prisma/client';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { TProjectIds } from '@/types';

@Injectable()
export class WorkflowDefinitionService {
  constructor(
    protected readonly repository: WorkflowDefinitionRepository,
    protected readonly customerService: CustomerService,
    protected readonly workflowEventEmitter: WorkflowEventEmitterService,
  ) {}

  async upgrateDefintionVersion(
    id: string,
    updateArgs: Pick<
      Prisma.WorkflowDefinitionUpdateArgs['data'],
      'definition' | 'config' | 'extensions' | 'submitStates'
    >,
    projectIds: TProjectIds,
  ) {
    const workflowDefintionToUpdate = await this.repository.findById(id, {}, projectIds);

    const { version } = workflowDefintionToUpdate;

    const updatedWorkflowDefinition = await this.repository.updateById(
      id,
      { data: { ...updateArgs, version: version + 1 } },
      workflowDefintionToUpdate.projectId ? workflowDefintionToUpdate.projectId : undefined,
      !workflowDefintionToUpdate.projectId,
    );

    return updatedWorkflowDefinition;
  }
}
