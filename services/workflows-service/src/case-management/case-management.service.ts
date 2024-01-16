import { ITransitionSchema } from '@/case-management/types/transition-schema';
import { AjvValidationError } from '@/errors';
import { TProjectId } from '@/types';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { ajv } from '@/common/ajv/ajv.validator';
import { WorkflowService } from '@/workflow/workflow.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkflowDefinition } from '@prisma/client';

@Injectable()
export class CaseManagementService {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
  ) {}

  async create(
    inputWorkflow: WorkflowRunDto,
    projectIds: TProjectId[],
    currentProjectId: TProjectId,
  ) {
    const { workflowId, context, config } = inputWorkflow;

    const hasSalesforceRecord =
      Boolean(inputWorkflow.salesforceObjectName) && Boolean(inputWorkflow.salesforceRecordId);
    const latestDefinitionVersion = await this.workflowDefinitionService.getLatestVersion(
      workflowId,
      currentProjectId,
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

  private validateEntity(workflowDefinition: WorkflowDefinition, entity: unknown) {
    const inputState = (workflowDefinition?.definition as { initial: string })?.initial as string;

    const transitionSchema = (
      workflowDefinition.transitionSchema as unknown as ITransitionSchema[]
    )?.find(schema => schema.state === inputState);

    if (!transitionSchema || !transitionSchema.schema) return;

    const validate = ajv.compile(transitionSchema.schema);

    const isValid = validate(entity);

    if (!isValid) {
      throw new AjvValidationError(validate.errors);
    }
  }
}
