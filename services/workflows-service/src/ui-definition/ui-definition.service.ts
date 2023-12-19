import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import type { TProjectIds } from '@/types';
import { Prisma, UiDefinitionContext } from '@prisma/client';
import { Injectable } from '@nestjs/common';

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

  async getByWorkflowDefinitionId(
    workflowDefinitionId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args: Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
  ) {
    return await this.repository.findByWorkflowDefinitionId(
      workflowDefinitionId,
      uiContext,
      args,
      projectIds,
    );
  }

  async getByRuntimeId(
    runtimeId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args: Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
  ) {
    const runtime = await this.workflowRuntimeRepository.findById(runtimeId, {}, projectIds);

    return this.getByWorkflowDefinitionId(
      runtime.workflowDefinitionId,
      uiContext,
      projectIds,
      args,
    );
  }
}
