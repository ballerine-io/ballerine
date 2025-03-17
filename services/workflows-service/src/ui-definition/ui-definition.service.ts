import {
  TranslationService,
  ITranslationServiceResource,
} from '@/providers/translation/translation.service';
import type { AnyRecord, TProjectId, TProjectIds } from '@/types';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { replaceNullsWithUndefined } from '@ballerine/common';
import { Injectable } from '@nestjs/common';
import { Prisma, UiDefinition, UiDefinitionContext, WorkflowRuntimeData } from '@prisma/client';
import { get } from 'lodash';

@Injectable()
export class UiDefinitionService {
  constructor(
    protected readonly repository: UiDefinitionRepository,
    protected readonly workflowRuntimeRepository: WorkflowRuntimeDataRepository,
  ) {}

  async create(args: Parameters<UiDefinitionRepository['create']>[0]) {
    return await this.repository.create(args);
  }

  async getById(
    id: string,
    args: Parameters<UiDefinitionRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.repository.findById(id, args, projectIds);
  }

  async findByArgs(args: Prisma.UiDefinitionFindFirstOrThrowArgs, projectIds: TProjectIds) {
    return await this.repository.findByArgs(args, projectIds);
  }

  async getByWorkflowDefinitionId(
    workflowDefinitionId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args?: Prisma.UiDefinitionFindFirstOrThrowArgs,
  ) {
    return await this.repository.findByWorkflowDefinitionId(
      workflowDefinitionId,
      uiContext,
      projectIds,
      args,
    );
  }

  async getByRuntimeId(
    runtimeId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args?: Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
  ) {
    const runtime = await this.workflowRuntimeRepository.findById(runtimeId, {}, projectIds);

    return this.getByWorkflowDefinitionId(runtime.workflowDefinitionId, uiContext, projectIds, {
      ...args,
      ...(runtime.uiDefinitionId ? { where: { id: runtime.uiDefinitionId } } : {}),
    });
  }

  async list(projectIds: TProjectIds) {
    return await this.repository.findMany({}, projectIds);
  }

  async update(
    id: string,
    args: Omit<Prisma.UiDefinitionUpdateArgs, 'where'>,
    projectIds: TProjectIds,
  ) {
    return await this.repository.update(
      {
        ...args,
        where: {
          id,
        },
      },
      projectIds,
    );
  }

  async cloneUIDefinitionById(id: string, projectId: TProjectId, newName: string) {
    const {
      createdAt,
      updatedAt,
      id: _,
      crossEnvKey,
      name,
      ...uiDefinition
    } = await this.repository.findById(id, {}, [projectId]);

    const uiDefinitionCopy = await this.create({
      data: replaceNullsWithUndefined({
        ...uiDefinition,
        name: newName,
      }),
    });

    return uiDefinitionCopy;
  }

  traverseUiSchema(
    uiSchema: Record<string, unknown>,
    context: WorkflowRuntimeData['context'],
    language: string,
    _translationService: TranslationService,
  ) {
    for (const key in uiSchema) {
      if (typeof uiSchema[key] === 'object' && uiSchema[key] !== null) {
        // If the property is an object (including arrays), recursively traverse it
        // @ts-expect-error - error from Prisma types fix
        this.traverseUiSchema(uiSchema[key], context, language, _translationService);
      } else if (typeof uiSchema[key] === 'string') {
        const options: AnyRecord = {};

        if (uiSchema.labelVariables) {
          Object.entries(uiSchema.labelVariables).forEach(([key, value]) => {
            options[key] = get(context, value);
          });
        }

        uiSchema[key] = _translationService.translate(uiSchema[key] as string, language, options);
      }
    }

    return uiSchema;
  }

  getTranslationServiceResources(
    uiDefinition: UiDefinition & { locales?: unknown },
  ): ITranslationServiceResource[] | undefined {
    if (!uiDefinition.locales) {
      return undefined;
    }

    return Object.entries(uiDefinition.locales).map(([language, resource]) => ({
      language,
      resource,
    }));
  }
}
