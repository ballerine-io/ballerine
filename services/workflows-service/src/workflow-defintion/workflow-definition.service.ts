import { CustomerService } from '@/customer/customer.service';
import { FilterService } from '@/filter/filter.service';
import { InputJsonValue, NullableJsonNullValueInput, TProjectId, TProjectIds } from '@/types';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { TWorkflowDefinitionWithTransitionSchema } from '@/workflow-defintion/types';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { DocumentInsertSchema, replaceNullsWithUndefined } from '@ballerine/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { merge } from 'lodash';
import {
  TCustomDataSchemaUpdateDto,
  TRootLevelContextSchemaDto,
} from '@/workflow-defintion/dtos/custom-data-schema-update-dto';

@Injectable()
export class WorkflowDefinitionService {
  constructor(
    protected readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
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
    const workflowDefintionToUpdate = await this.getLatestVersion(id, [projectId]);

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
    const newVersionDefinition = await this.workflowDefinitionRepository.create({
      data: createArgs,
    });

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
    const workflowDefinition = await this.workflowDefinitionRepository.findById(id, {}, projectIds);

    return await this.workflowDefinitionRepository.findByLatestVersion(
      workflowDefinition.name,
      projectIds,
    );
  }

  async getLastVersionByVariant(definitionVariant: string, projectIds: TProjectIds) {
    return await this.workflowDefinitionRepository.findLatestVersionByVariant(
      definitionVariant,
      projectIds,
    );
  }

  async getLatestDefinitionWithTransitionSchema(
    id: string,
    projectIds: TProjectIds,
  ): Promise<TWorkflowDefinitionWithTransitionSchema> {
    const workflowDefinition = await this.getLatestVersion(id, projectIds);

    return workflowDefinition as TWorkflowDefinitionWithTransitionSchema;
  }

  async getList(dto: GetWorkflowDefinitionListDto, projectIds: TProjectIds) {
    const [totalItems, items] = await Promise.all([
      this.workflowDefinitionRepository.getListCount(dto, projectIds),
      this.workflowDefinitionRepository.getList(dto, projectIds),
    ]);

    const totalPages = Math.ceil((totalItems as number) / dto.limit);

    return {
      items,
      meta: {
        total: totalItems,
        pages: totalPages,
      },
    };
  }

  async getInputContextSchema(id: string, projectIds: TProjectIds) {
    const { contextSchema } = await this.workflowDefinitionRepository.findById(
      id,
      {
        select: {
          contextSchema: true,
        },
      },
      projectIds,
    );

    return (contextSchema as { schema: TRootLevelContextSchemaDto }).schema;
  }

  async updateInputContextCustomDataSchema(
    id: string,
    projectIds: TProjectId[],
    customDataSchema: TCustomDataSchemaUpdateDto,
  ) {
    const inputContextSchema = await this.getInputContextSchema(id, projectIds);

    inputContextSchema.properties = {
      ...(inputContextSchema.properties ?? {}),
      customData: customDataSchema,
    };

    await this.workflowDefinitionRepository.updateById(
      id,
      {
        data: {
          contextSchema: { type: 'json-schema', schema: inputContextSchema as InputJsonValue },
        },
      },
      projectIds,
    );

    return customDataSchema;
  }

  async getDocumentsSchema(id: string, projectIds: TProjectIds) {
    const { documentsSchema } = await this.workflowDefinitionRepository.findById(
      id,
      {
        select: {
          documentsSchema: true,
        },
      },
      projectIds,
    );

    return documentsSchema as Record<string, unknown>;
  }

  async updateDocumentsSchema(
    id: string,
    projectIds: TProjectId[],
    documentsSchema: Array<typeof DocumentInsertSchema>,
  ) {
    return await this.workflowDefinitionRepository.updateById(
      id,
      {
        data: { documentsSchema: documentsSchema as NullableJsonNullValueInput | InputJsonValue },
      },
      projectIds,
    );
  }
}
