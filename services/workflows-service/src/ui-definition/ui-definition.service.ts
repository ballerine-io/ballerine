import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { TProjectId, TProjectIds } from '@/types';
import { getDocumentsByCountry } from '@ballerine/common';
import { CountryCode } from '@/common/countries';
import { TSchemaOption } from '@/ui-definition/type';
import { Prisma, UiDefinitionContext } from '@prisma/client';
import { Injectable } from '@nestjs/common';

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

  async getByRuntimeId(
    runtimeId: string,
    context: typeof UiDefinitionContext,
    projectIds: TProjectIds,
    args: Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
  ) {
    const runtime = await this.workflowRuntimeRepository.findById(runtimeId, {}, projectIds);
    return await this.repository.findByWorkflowDefinitionId(
      runtime.workflowDefinitionId,
      context,
      args,
      projectIds,
    );
  }
  async getDocumentSchemaByRuntimeId(
    runtimeId: string,
    context: typeof UiDefinitionContext,
    projectIds: TProjectIds,
    countryCode: CountryCode,
    category: string,
    type: string,
  ) {
    // TODO: Replace the logic from current schemas in Common package to the database
    const uiDefinition = await this.getByRuntimeId(runtimeId, context, projectIds, {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documents = (uiDefinition.schemaOptions as TSchemaOption)['document'];

    const documentsByCountry = getDocumentsByCountry(countryCode);
    return documentsByCountry.find(document => {
      if (document.category === category && document.type === type) {
        return document;
      }
    });
  }
}
