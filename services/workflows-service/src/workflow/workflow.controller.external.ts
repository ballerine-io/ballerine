import { defaultPrismaTransactionOptions, isRecordNotFoundError } from '@/prisma/prisma.util';
import { UserData } from '@/user/user-data.decorator';
import { UserInfo } from '@/user/user-info';
import * as common from '@nestjs/common';
import { HttpStatus, NotFoundException, Query, Res } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import type { WorkflowRuntimeData } from '@prisma/client';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { putPluginsExampleResponse } from '@/workflow/workflow-controller-examples';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import type { AnyRecord, InputJsonValue, TProjectId, TProjectIds } from '@/types';
import { WORKFLOW_DEFINITION_TAG } from '@/workflow-defintion/workflow-definition.controller';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { CreateCollectionFlowUrlDto } from '@/workflow/dtos/create-collection-flow-url.dto';
import { GetWorkflowsRuntimeInputDto } from '@/workflow/dtos/get-workflows-runtime-input.dto';
import { GetWorkflowsRuntimeOutputDto } from '@/workflow/dtos/get-workflows-runtime-output.dto';
import { WorkflowHookQuery } from '@/workflow/dtos/workflow-hook-query';
import { WorkflowIdWithEventInput } from '@/workflow/dtos/workflow-id-with-event-input';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import { plainToClass } from 'class-transformer';
import type { Response } from 'express';
import * as errors from '../errors';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { WorkflowRunDto } from './dtos/workflow-run';
import {
  WorkflowDefinitionWhereUniqueInput,
  WorkflowDefinitionWhereUniqueInputSchema,
} from './dtos/workflow-where-unique-input';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { WorkflowService } from './workflow.service';
import { Validate } from 'ballerine-nestjs-typebox';
import { PutWorkflowExtensionSchema, WorkflowExtensionSchema } from './schemas/extensions.schemas';
import { type Static, Type } from '@sinclair/typebox';
import {
  buildCollectionFlowUrl,
  DefaultContextSchema,
  defaultContextSchema,
  isObject,
} from '@ballerine/common';
import { WorkflowRunSchema } from './schemas/workflow-run';
import { ValidationError } from '@/errors';
import { WorkflowRuntimeListItemModel } from '@/workflow/workflow-runtime-list-item.model';
import { CreateTokenDto } from '@/workflow/dtos/create-token.dto';
import { type PartialDeep } from 'type-fest';

export const WORKFLOW_TAG = 'Workflows';
@swagger.ApiBearerAuth()
@swagger.ApiTags(WORKFLOW_TAG)
@common.Controller('external/workflows')
export class WorkflowControllerExternal {
  constructor(
    protected readonly workflowService: WorkflowService,
    protected readonly normalizeService: HookCallbackHandlerService,
    private readonly workflowTokenService: WorkflowTokenService,
    private readonly workflowDefinitionService: WorkflowDefinitionService,
    private readonly prismaService: PrismaService,
  ) {}

  // GET /workflows
  @common.Get('/')
  @swagger.ApiOkResponse({ type: [GetWorkflowsRuntimeOutputDto] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  async listWorkflowRuntimeData(
    @Query() query: GetWorkflowsRuntimeInputDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<GetWorkflowsRuntimeOutputDto> {
    const results = await this.workflowService.listRuntimeData(
      {
        page: query.page,
        size: query.limit,
        status: query.status,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection,
      },
      projectIds,
    );

    return plainToClass(GetWorkflowsRuntimeOutputDto, results);
  }

  @common.Get('/workflow-definition/:id')
  @ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async getWorkflowDefinition(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return await this.workflowService.getWorkflowDefinitionById(
      params.id,
      {
        include: {
          uiDefinitions: true,
        },
      },
      projectIds,
    );
  }

  @swagger.ApiTags(WORKFLOW_DEFINITION_TAG, WORKFLOW_TAG)
  @common.Get('/workflow-definition/:id/plugins')
  @ApiResponse({
    status: 200,
    schema: WorkflowExtensionSchema,
    example: putPluginsExampleResponse,
  })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async listWorkflowPlugins(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const result = await this.workflowDefinitionService.getLatestVersion(params.id, projectIds);

    return result.extensions;
  }

  @swagger.ApiTags(WORKFLOW_DEFINITION_TAG, WORKFLOW_TAG)
  @common.Put('/workflow-definition/:workflow_definition_id/plugins')
  @swagger.ApiBody({
    schema: PutWorkflowExtensionSchema,
    examples: {
      1: {
        value: putPluginsExampleResponse,
        summary: 'The plugins for the workflow',
        description: 'The plugins for the workflow',
      },
    },
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'workflow_definition_id',
        description: `The workflow's definition id`,
        schema: WorkflowDefinitionWhereUniqueInputSchema,
        example: {
          value: putPluginsExampleResponse,
          summary: 'The plugins for the workflow',
          description: 'The plugins for the workflow',
        },
      },
      {
        type: 'body',
        schema: WorkflowExtensionSchema,
      },
    ],
    response: Type.Any(),
  })
  @ApiResponse({
    description: 'The user records',
    schema: WorkflowExtensionSchema,
    example: putPluginsExampleResponse,
  })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async addPlugins(
    @common.Param('workflow_definition_id')
    workflowDefinitionId: Static<typeof WorkflowDefinitionWhereUniqueInputSchema>,
    @common.Body() body: Static<typeof WorkflowExtensionSchema>,
    @CurrentProject() projectId: TProjectId,
    @common.Response() res: Response,
  ) {
    const upgradedWorkflowDef = await this.workflowDefinitionService.upgradeDefinitionVersion(
      workflowDefinitionId,
      {
        extensions: body as InputJsonValue,
      },
      projectId,
    );

    if (upgradedWorkflowDef?.extensions) {
      return res.json(upgradedWorkflowDef.extensions);
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: WorkflowRuntimeListItemModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseCustomerAuthGuard()
  async getRunnableWorkflowDataById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      params.id,
      {},
      projectIds,
    );

    if (!workflowRuntimeData) {
      throw new NotFoundException(`No resource with id [${params.id}] was found`);
    }

    return workflowRuntimeData;
  }

  // PATCH /workflows/:id
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async updateById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowDefinitionUpdateInput,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.workflowService.updateWorkflowRuntimeData(
        params.id,
        data,
        currentProjectId,
      );
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw error;
    }
  }

  @common.Post('/run')
  @swagger.ApiOkResponse({
    description: 'Workflow run initiated successfully',
    schema: {
      type: 'object',
      properties: {
        workflowDefinitionId: { type: 'string' },
        workflowRuntimeId: { type: 'string' },
        ballerineEntityId: { type: 'string' },
        entity: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['individual', 'business'],
            },
            id: { type: 'string' },
          },
          required: ['type', 'id'],
        },
      },
    },
  })
  @swagger.ApiOperation({
    summary: `The /run endpoint initiates and executes various workflows based on initial data and configurations. Supported workflows include KYB, KYC, KYB with UBOs, KYB with Associated Companies, Ongoing Sanctions, and Merchant Monitoring. To start a workflow, provide workflowId, context (with entity and documents), and config (with checks) in the request body. Customization is possible through the config object. The response includes workflowDefinitionId, workflowRuntimeId, ballerineEntityId, and entities. Workflow execution is asynchronous, with progress tracked via webhook notifications.`,
  })
  @UseCustomerAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiUnauthorizedResponse({ type: common.UnauthorizedException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @swagger.ApiBadRequestResponse({ type: ValidationError })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiBody({
    // @ts-expect-error -- Something with swagger package
    schema: WorkflowRunSchema,
    description: 'Workflow run data.',
    examples: {
      KYB: {
        value: {
          workflowId: 'kyb-us-1',
          context: {
            entity: {
              type: 'business',
              id: 'my-enduser-id',
              data: {
                country: 'US',
                registrationNumber: '756OPOPOP08238',
                companyName: 'MOCK COMPANY LIMITED',
                additionalInfo: {
                  mainRepresentative: {
                    email: 'email@ballerine.com',
                    lastName: 'Last',
                    firstName: 'First',
                  },
                },
              },
            },
            documents: [],
          },
          config: {
            subscriptions: [
              {
                type: 'webhook',
                url: 'https://webhook.site/f82ea191-9d64-424f-887e-f8418faf4fe9',
                events: ['workflow.completed'],
              },
            ],
          },
        },
      },
      'Merchant Monitoring': {
        value: {
          workflowId: '0k3j3k3g3h3i3j3k3g3h3i3',
          context: {
            entity: {
              type: 'business',
              id: '432109',
              data: {
                companyWebsite: 'https://example.com',
                lineOfBusiness: 'Retail',
              },
            },
          },
          config: {
            checks: {
              ecosystem: {
                enabled: true,
                parameters: {},
              },
              lineOfBusiness: {
                enabled: true,
                parameters: {},
              },
              socialMediaReport: {
                enabled: true,
                parameters: {},
              },
              transactionLaundering: {
                enabled: true,
                parameters: {},
              },
              websiteCompanyAnalysis: {
                enabled: true,
                parameters: {},
              },
            },
          },
        },
      },
    },
  })
  async createWorkflowRuntimeData(
    @common.Body() body: WorkflowRunDto,
    @Res() res: Response,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<unknown> {
    const { workflowId, context, config } = body;

    if (!context || !isObject(context)) {
      throw new common.BadRequestException('Context is required');
    }

    if (
      !isObject(context.entity) ||
      (!('id' in context.entity) && !('ballerineEntityId' in context.entity))
    ) {
      throw new common.BadRequestException('Entity id is required');
    }

    if (!workflowId) {
      throw new common.BadRequestException('Workflow id is required');
    }

    const hasSalesforceRecord =
      Boolean(body.salesforceObjectName) && Boolean(body.salesforceRecordId);

    let latestDefinitionVersion;

    try {
      latestDefinitionVersion = await this.workflowDefinitionService.getLatestVersion(
        workflowId,
        projectIds,
      );
    } catch (e) {
      throw new common.BadRequestException(`Workflow Definition ${workflowId} was not found`);
    }

    const actionResult = await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: latestDefinitionVersion.id,
      context,
      config,
      projectIds,
      currentProjectId,
      ...(hasSalesforceRecord && {
        salesforceObjectName: body.salesforceObjectName,
        salesforceRecordId: body.salesforceRecordId,
      }),
    });

    return res.json({
      workflowDefinitionId: actionResult[0]?.workflowDefinition.id,
      workflowRuntimeId: actionResult[0]?.workflowRuntimeData.id,
      ballerineEntityId: actionResult[0]?.ballerineEntityId,
      entities: actionResult[0]?.entities,
    });
  }

  @common.Post('/create-collection-flow-url')
  @swagger.ApiOkResponse()
  @UseCustomerAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createCollectionFlowUrl(
    @common.Body() { workflowRuntimeDataId }: CreateCollectionFlowUrlDto,
  ) {
    const workflow = await this.workflowTokenService.findFirstByWorkflowRuntimeDataIdUnscoped(
      workflowRuntimeDataId,
    );

    if (!workflow) {
      throw new NotFoundException(
        `No WorkflowRuntimeDataId was found for ${JSON.stringify(workflowRuntimeDataId)}`,
      );
    }

    return {
      collectionFlowUrl: buildCollectionFlowUrl(env.COLLECTION_FLOW_URL, {
        workflowId: workflowRuntimeDataId,
        token: workflow.token,
      }),
    };
  }

  @common.Post('/create-token')
  @swagger.ApiOkResponse()
  @UseCustomerAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createToken(
    @common.Body() { expiry, workflowRuntimeDataId, endUserId }: CreateTokenDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const expiresAt = new Date(Date.now() + (expiry || 30) * 24 * 60 * 60 * 1000);

    const { token } = await this.workflowTokenService.create(currentProjectId, {
      workflowRuntimeDataId: workflowRuntimeDataId,
      expiresAt,
      endUserId,
    });

    return {
      token,
    };
  }

  @common.Post('/:id/event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async event(
    @UserData() _userInfo: UserInfo,
    @common.Param('id') id: string,
    @common.Body() data: WorkflowEventInput,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    return await this.workflowService.event(
      {
        ...data,
        id,
      },
      projectIds,
      currentProjectId,
    );
  }

  @common.Post('/:id/send-event')
  @swagger.ApiOkResponse()
  @UseCustomerAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async sendEvent(
    @UserData() _userInfo: UserInfo,
    @common.Param('id') id: string,
    @common.Body() data: WorkflowEventInput,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return await this.workflowService.event(
      {
        ...data,
        id,
      },
      projectIds,
      currentProjectId,
    );
  }

  @common.Get('/:id/context')
  @UseCustomerAuthGuard()
  @swagger.ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        // @ts-expect-error -- ss
        context: defaultContextSchema,
      },
    },
  })
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getWorkflowRuntimeDataContext(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    try {
      const context = await this.workflowService.getWorkflowRuntimeDataContext(id, projectIds);

      return { context };
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new NotFoundException(`No resource was found for ${JSON.stringify(id)}`);
      }

      throw err;
    }
  }

  @common.Post('/:id/hook/:event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async hook(
    @common.Param() params: WorkflowIdWithEventInput,
    @common.Query() query: WorkflowHookQuery,
    @common.Body() hookResponse: unknown,
  ): Promise<void> {
    try {
      await this.prismaService.$transaction(async transaction => {
        const workflowRuntime =
          await this.workflowService.getWorkflowRuntimeDataByIdAndLockUnscoped({
            id: params.id,
            transaction,
          });

        const context = await this.normalizeService.handleHookResponse({
          workflowRuntime,
          data: hookResponse as AnyRecord,
          resultDestinationPath: query.resultDestination || 'hookResponse',
          processName: query.processName,
          projectIds: [workflowRuntime.projectId],
          currentProjectId: workflowRuntime.projectId,
        });

        if (params.event !== BUILT_IN_EVENT.NO_OP) {
          await this.workflowService.event(
            {
              id: params.id,
              name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
              payload: {
                newContext: context,
                arrayMergeOption: ARRAY_MERGE_OPTION.REPLACE,
              },
            },
            [workflowRuntime.projectId],
            workflowRuntime.projectId,
            transaction,
          );
        }

        if (params.event && params.event !== 'undefined') {
          await this.workflowService.event(
            {
              id: params.id,
              name: params.event,
            },
            [workflowRuntime.projectId],
            workflowRuntime.projectId,
            transaction,
          );
        }
      }, defaultPrismaTransactionOptions);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`, {
          cause: error,
        });
      }

      throw error;
    }

    return;
  }

  @common.Patch('/:workflowRuntimeDataId/sync-entity')
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: Type.Object({
      message: Type.String(),
      statusCode: Type.Literal(400),
      timestamp: Type.String({
        format: 'date-time',
      }),
      path: Type.String(),
      errors: Type.Array(Type.Object({ message: Type.String(), path: Type.String() })),
    }),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'workflowRuntimeDataId',
        description: `The id of the workflow runtime data to update`,
        schema: Type.String(),
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      {
        type: 'body',
        schema: Type.Any(),
      },
    ],
    response: Type.Any(),
  })
  async updateContextAndSyncEntity(
    @common.Param('workflowRuntimeDataId')
    workflowRuntimeDataId: string,
    @common.Body() body: PartialDeep<DefaultContextSchema>,
    @CurrentProject() projectId: TProjectId,
  ) {
    return await this.workflowService.updateContextAndSyncEntity({
      workflowRuntimeDataId,
      context: body,
      projectId,
    });
  }
}
