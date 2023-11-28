import { Injectable } from '@nestjs/common';
import { CustomerService } from '@/customer/customer.service';
import { Prisma } from '@prisma/client';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { TProjectId } from '@/types';
import { merge } from 'lodash';
import { FilterService } from '@/filter/filter.service';

@Injectable()
export class WorkflowDefinitionService {
  constructor(
    protected readonly repository: WorkflowDefinitionRepository,
    protected readonly customerService: CustomerService,
    protected readonly filterService: FilterService,
  ) {}

  async upgrateDefintionVersion(
    id: string,
    updateArgs: Partial<
      Pick<
        Prisma.WorkflowDefinitionUpdateArgs['data'],
        'definition' | 'config' | 'extensions' | 'submitStates'
      >
    >,
    projectId: TProjectId,
  ) {
    const workflowDefintionToUpdate = await this.repository.findById(id, {}, [projectId]);

    const { id: _id, version, ...restArgs } = workflowDefintionToUpdate;

    const createArgs = merge(restArgs, updateArgs, {
      version: version + 1,
    }) as Prisma.WorkflowDefinitionCreateArgs['data'];
    const updatedWorkflowVersion = await this.repository.create({ data: createArgs });

    const filters = await this.filterService.list({ where: { projectId: projectId, query: {} } }, [
      projectId,
    ]);

    for (const filter in filters) {
    }
  }
}
