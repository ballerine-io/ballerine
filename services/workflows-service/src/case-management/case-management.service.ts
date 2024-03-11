import { ValidationError } from '@/errors';
import { TProjectId, TProjectIds } from '@/types';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { ajv } from '@/common/ajv/ajv.validator';
import { WorkflowService } from '@/workflow/workflow.service';
import { Injectable } from '@nestjs/common';
import { TWorkflowDefinitionWithTransitionSchema } from '@/workflow-defintion/types';

@Injectable()
export class CaseManagementService {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
  ) {}

  async create(
    inputWorkflow: WorkflowRunDto,
    projectIds: TProjectIds,
    currentProjectId: TProjectId,
  ) {
    const { workflowId, context, config } = inputWorkflow;

    const hasSalesforceRecord =
      Boolean(inputWorkflow.salesforceObjectName) && Boolean(inputWorkflow.salesforceRecordId);
    const latestDefinitionVersion =
      await this.workflowDefinitionService.getLatestDefinitionWithTransitionSchema(
        workflowId,
        projectIds,
      );

    this.validateEntity(latestDefinitionVersion, context?.entity);

    const actionResult = await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: latestDefinitionVersion.id,
      context,
      config,
      projectIds,
      currentProjectId,
      ...(hasSalesforceRecord && {
        salesforceObjectName: inputWorkflow.salesforceObjectName,
        salesforceRecordId: inputWorkflow.salesforceRecordId,
      }),
    });

    return {
      workflowDefinitionId: actionResult[0]!.workflowDefinition.id,
      workflowRuntimeId: actionResult[0]!.workflowRuntimeData.id,
      ballerineEntityId: actionResult[0]!.ballerineEntityId,
    };
  }

  private validateEntity(
    workflowDefinition: TWorkflowDefinitionWithTransitionSchema,
    entity: unknown,
  ) {
    const inputState = workflowDefinition?.definition?.initial as string;

    const dataSchema =
      workflowDefinition.definition?.states[inputState]?.meta?.inputSchema?.dataSchema;

    if (!dataSchema?.schema) return;

    const validate = ajv.compile(dataSchema.schema);

    const isValid = validate(entity);

    if (!isValid) {
      throw ValidationError.fromAjvError(validate.errors!);
    }
  }
}
