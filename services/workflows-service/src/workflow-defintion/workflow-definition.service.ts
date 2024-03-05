import { Injectable } from '@nestjs/common';
import { CustomerService } from '@/customer/customer.service';
import { Prisma } from '@prisma/client';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { TProjectId, TProjectIds } from '@/types';
import { merge } from 'lodash';
import { FilterService } from '@/filter/filter.service';
import { replaceNullsWithUndefined } from '@ballerine/common';
import { TWorkflowDefinitionWithTransitionSchema } from '@/workflow-defintion/types';

@Injectable()
export class WorkflowDefinitionService {
  constructor(
    protected readonly repository: WorkflowDefinitionRepository,
    protected readonly customerService: CustomerService,
    protected readonly filterService: FilterService,
  ) {}

  async upgradeDefinitionVersion(
    id: string,
    updateArgs: Partial<
      Pick<
        Prisma.WorkflowDefinitionUpdateArgs['data'],
        'definition' | 'config' | 'extensions' | 'submitStates' | 'contextSchema'
      >
    >,
    projectId: TProjectId,
  ) {
    const workflowDefintionToUpdate = await this.repository.findById(id, {}, [projectId]);

    const {
      id: _id,
      version,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...restArgs
    } = workflowDefintionToUpdate;

    const createArgs = replaceNullsWithUndefined(
      merge(restArgs, updateArgs, {
        version: version + 1,
      }),
    ) as Prisma.WorkflowDefinitionCreateArgs['data'];
    const newVersionDefinition = await this.repository.create({ data: createArgs });

    const relevantFilters = (
      await this.filterService.list({ where: { projectId: projectId } }, [projectId])
    ).filter(filter => {
      const { where: whereQuery } = filter.query as {
        where: { workflowDefinitionId: string | { in: string[] } };
      };

      if (typeof whereQuery.workflowDefinitionId === 'string') {
        return whereQuery.workflowDefinitionId === id;
      }

      return whereQuery.workflowDefinitionId.in.includes(id);
    });

    for (const filter of relevantFilters) {
      const { where: whereQuery, ...rest } = filter.query as any;

      if (typeof whereQuery.workflowDefinitionId === 'string') {
        whereQuery.workflowDefinitionId = {
          in: [whereQuery.workflowDefinitionId, newVersionDefinition.id],
        };
      } else {
        whereQuery.workflowDefinitionId.in = whereQuery.workflowDefinitionId.in.concat(
          newVersionDefinition.id,
        );
      }

      await this.filterService.updatedById(filter.id, {
        data: { query: { ...rest, where: whereQuery } },
        where: {},
      });
    }

    return newVersionDefinition;
  }

  async getLatestVersion(id: string, projectIds: TProjectIds) {
    const workflowDefinition = await this.repository.findById(id, {}, projectIds);

    return await this.repository.findByLatestVersion(workflowDefinition.name, projectIds);
  }

  async getLatestDefinitionWithTransitionSchema(
    id: string,
    projectIds: TProjectIds,
  ): Promise<TWorkflowDefinitionWithTransitionSchema> {
    const workflowDefinition = await this.getLatestVersion(id, projectIds);

    return workflowDefinition as TWorkflowDefinitionWithTransitionSchema;
  }
}
