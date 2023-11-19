import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import type { TProjectId, TProjectIds } from '@/types';
import { getDocumentsByCountry } from '@ballerine/common';
import type { CountryCode } from '@/common/countries';
import type { TSchemaOption } from '@/ui-definition/type';
import { Prisma, UiDefinitionContext } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { generateEndUserDocumentTask } from '@/ui-definition/utils/generate-end-user-document-task';

@Injectable()
export class UiDefinitionService {
  constructor(
    protected readonly repository: UiDefinitionRepository,
    protected readonly workflowRuntimeRepository: WorkflowRuntimeDataRepository,
  ) {}

  async create(args: Parameters<UiDefinitionRepository['create']>[0], projectId: TProjectId) {
    return await this.repository.create(args, projectId);
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
  async getDocumentSchemaByRuntimeId(
    runtimeId: string,
    uiContext: keyof typeof UiDefinitionContext,
    projectIds: TProjectIds,
    countryCode: CountryCode,
    category: string,
    type: string,
  ) {
    // TODO: Replace the logic from current schemas in Common package to the database
    const uiDefinition = await this.getByRuntimeId(runtimeId, uiContext, projectIds, {});
    const runtimeData = await this.workflowRuntimeRepository.findById(runtimeId, {}, projectIds);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documents = (uiDefinition.schemaOptions as TSchemaOption)['document'];
    generateEndUserDocumentTask();

    const documentsByCountry = getDocumentsByCountry(countryCode);
    return documentsByCountry.find(document => {
      if (document.category === category && document.type === type) {
        return document;
      }
    });
  }
}
