import { ValidationError } from '@/errors';
import { TProjectId, TProjectIds } from '@/types';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { ajv } from '@/common/ajv/ajv.validator';
import { WorkflowService } from '@/workflow/workflow.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TWorkflowDefinitionWithTransitionSchema } from '@/workflow-defintion/types';
import { PrismaService } from '@/prisma/prisma.service';
import { EndUserService } from '@/end-user/end-user.service';
import { randomUUID } from 'crypto';
import { BusinessPosition } from '@prisma/client';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import { UboToEntityAdapter } from './types';

@Injectable()
export class CaseManagementService {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
    protected readonly prismaService: PrismaService,
    protected readonly endUserService: EndUserService,
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

    if (!dataSchema?.schema) {
      return;
    }

    const validate = ajv.compile(dataSchema.schema);

    const isValid = validate(entity);

    if (!isValid) {
      throw ValidationError.fromAjvError(validate.errors!);
    }
  }

  async createUbo({
    workflowId,
    ubo,
    projectId,
  }: {
    workflowId: string;
    ubo: Record<string, any>;
    projectId: TProjectId;
  }) {
    await this.prismaService.$transaction(async transaction => {
      const workflowRuntimeData =
        await this.workflowService.getWorkflowRuntimeDataByIdAndLockUnscoped({
          id: workflowId,
          transaction,
        });

      if (!workflowRuntimeData.businessId) {
        throw new BadRequestException(
          `Attempted to create a UBO to a parent workflow without a business`,
        );
      }

      const uboToEntityAdapter = (ubo => {
        return {
          id: randomUUID(),
          type: 'individual',
          variant: 'ubo',
          data: {
            firstName: ubo.firstName,
            lastName: ubo.lastName,
            email: ubo.email,
            percentageOfOwnership: ubo.ownershipPercentage ?? ubo.percentageOfOwnership,
            role: ubo.role,
            phoneNumber: ubo.phone,
            isAuthorizedSignatory: ubo.isAuthorizedSignatory,
            country: ubo.country,
            city: ubo.city,
            street: ubo.street,
            sourceOfWealth: ubo.sourceOfWealth,
            sourceOfFunds: ubo.sourceOfFunds,
            additionalInfo: {
              companyName: workflowRuntimeData.context.entity.data.companyName,
              customerCompany:
                workflowRuntimeData.context.collectionFlow.additionalInformation.customerCompany,
            },
          },
        };
      }) satisfies UboToEntityAdapter;

      const [{ workflowRuntimeData: childWorkflowRuntimeData, ballerineEntityId }] =
        await this.workflowService.createOrUpdateWorkflowRuntime(
          {
            workflowDefinitionId: 'kyc_email_session_example',
            parentWorkflowId: workflowId,
            currentProjectId: projectId,
            projectIds: [projectId],
            context: {
              entity: uboToEntityAdapter(ubo),
              documents: [],
            },
            config: {},
          },
          transaction,
        );

      await this.workflowService.event(
        {
          id: childWorkflowRuntimeData.id,
          name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
          payload: {
            newContext: {
              entity: {
                data: {
                  ballerineEntityId,
                },
              },
            },
            arrayMergeOption: ARRAY_MERGE_OPTION.BY_ID,
          },
        },
        [projectId],
        projectId,
        transaction,
      );

      await transaction.endUsersOnBusinesses.create({
        data: {
          endUserId: ballerineEntityId,
          businessId: workflowRuntimeData.businessId,
          position: BusinessPosition.ubo,
        },
      });
    });
  }

  async deleteUbosByIds({
    workflowId,
    ids,
    projectId,
    deletedBy,
  }: {
    workflowId: string;
    ids: string[];
    projectId: TProjectId;
    deletedBy: string;
  }) {
    await this.prismaService.$transaction(async transaction => {
      const workflowRuntimeData =
        await this.workflowService.getWorkflowRuntimeDataByIdAndLockUnscoped({
          id: workflowId,
          transaction,
        });
      const workflowRuntimeDataByEndUserIds = await transaction.workflowRuntimeData.findMany({
        where: {
          endUserId: { in: ids },
          parentRuntimeDataId: workflowId,
        },
        select: {
          id: true,
          workflowDefinitionId: true,
        },
      });

      const workflowRuntimeDataToDelete = workflowRuntimeDataByEndUserIds.map(data => data.id);
      const workflowDefinitionIdsToDelete = workflowRuntimeDataByEndUserIds.map(
        data => data.workflowDefinitionId,
      );

      const childWorkflows = Object.entries(
        workflowRuntimeData.context.childWorkflows ?? {},
      ).reduce((acc, [key, value]) => {
        // First key is the workflow definition id - keep unrelated workflows unchanged
        if (!workflowDefinitionIdsToDelete.includes(key)) {
          acc[key] = value as Record<string, any>;
        }

        // Second key is the child workflow runtime data id - remove the ones we are deleting by not assigning them to the accumulator
        acc[key] = Object.entries(value as Record<string, any>).reduce((acc, [key, value]) => {
          if (workflowRuntimeDataToDelete.includes(key)) {
            return acc;
          }

          acc[key] = value;

          return acc;
        }, {} as Record<string, any>);

        return acc;
      }, {} as Record<string, Record<string, any>>);

      await this.workflowService.event(
        {
          id: workflowId,
          name: BUILT_IN_EVENT.UPDATE_CONTEXT,
          payload: {
            context: {
              ...workflowRuntimeData.context,
              childWorkflows,
            },
          },
        },
        [projectId],
        projectId,
        transaction,
      );

      await transaction.workflowRuntimeData.updateMany({
        where: {
          endUserId: { in: ids },
          projectId,
        },
        data: {
          deletedAt: new Date(),
          deletedBy,
        },
      });
    });
  }
}
