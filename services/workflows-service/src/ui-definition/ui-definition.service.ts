import type { TProjectId, TProjectIds } from '@/types';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { Injectable } from '@nestjs/common';
import { Prisma, UiDefinitionContext } from '@prisma/client';

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
    args: Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
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
    console.log({
      ...args,
      where: {
        id,
      },
    });

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

  async updateById<T extends Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>,
  ) {
    return await this.repository.updateById(id, args);
  }

  async cloneUIDefinitionById(id: string, projectId: TProjectId) {
    const {
      createdAt,
      updatedAt,
      id: _,
      ...uiDefinition
    } = await this.repository.findById(id, {}, [projectId]);

    //@ts-ignore
    const uiDefinitionCopy = await this.create({ data: replaceNullsWithUndefined(uiDefinition) });

    return uiDefinitionCopy;
  }
}
