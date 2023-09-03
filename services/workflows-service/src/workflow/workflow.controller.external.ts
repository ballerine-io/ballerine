/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserData } from '@/user/user-data.decorator';
import { UserInfo } from '@/user/user-info';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as common from '@nestjs/common';
import { NotFoundException, Query, Res } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { WorkflowRuntimeData } from '@prisma/client';
import * as nestAccessControl from 'nest-access-control';
import * as errors from '../errors';
import { IntentDto } from './dtos/intent';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { WorkflowDefinitionWhereUniqueInput } from './dtos/workflow-where-unique-input';
import { RunnableWorkflowData } from './types';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { IntentResponse, WorkflowService } from './workflow.service';
import { Response } from 'express';
import { WorkflowRunDto } from './dtos/workflow-run';
import { plainToClass } from 'class-transformer';
import { GetWorkflowsRuntimeInputDto } from '@/workflow/dtos/get-workflows-runtime-input.dto';
import { GetWorkflowsRuntimeOutputDto } from '@/workflow/dtos/get-workflows-runtime-output.dto';
import { WorkflowIdWithEventInput } from '@/workflow/dtos/workflow-id-with-event-input';
import { WorkflowHookQuery } from '@/workflow/dtos/workflow-hook-query';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectId, TProjectIds } from '@/types';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiBearerAuth()
@swagger.ApiTags('external/workflows')
@common.Controller('external/workflows')
export class WorkflowControllerExternal {
  constructor(
    protected readonly service: WorkflowService,
    protected readonly normalizeService: HookCallbackHandlerService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
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
    const results = await this.service.listRuntimeData(
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
  @UseCustomerAuthGuard()
  async getWorkflowDefinition(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return await this.service.getWorkflowDefinitionById(params.id, {}, projectIds);
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseCustomerAuthGuard()
  async getRunnableWorkflowDataById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<RunnableWorkflowData> {
    const workflowRuntimeData = await this.service.getWorkflowRuntimeDataById(
      params.id,
      {},
      projectIds,
    );
    if (!workflowRuntimeData) {
      throw new NotFoundException(`No resource with id [${params.id}] was found`);
    }

    const workflowDefinition = await this.service.getWorkflowDefinitionById(
      workflowRuntimeData.workflowDefinitionId,
      {},
      projectIds,
    );

    return {
      workflowDefinition,
      workflowRuntimeData,
    };
  }

  // PATCH /workflows/:id
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseCustomerAuthGuard()
  async updateById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowDefinitionUpdateInput,
    @CurrentProject() projectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.updateWorkflowRuntimeData(params.id, data, projectId);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  // POST /intent
  @common.Post('/intent')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseCustomerAuthGuard()
  async intent(
    @common.Body() { intentName, entityId }: IntentDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<IntentResponse> {
    // Rename to intent or getRunnableWorkflowDataByIntent?
    const entityType = intentName === 'kycSignup' ? 'endUser' : 'business';
    return await this.service.resolveIntent(intentName, entityId, entityType, projectIds);
  }

  @common.Post('/run')
  @swagger.ApiOkResponse()
  @UseCustomerAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createWorkflowRuntimeData(
    @common.Body() body: WorkflowRunDto,
    @Res() res: Response,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<any> {
    const { workflowId, context, config } = body;
    const { entity } = context;

    if (!entity.id && !entity.ballerineEntityId)
      throw new common.BadRequestException('Entity id is required');

    const actionResult = await this.service.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: workflowId,
      context,
      config,
      projectIds,
    });

    return res.json({
      workflowDefinitionId: actionResult[0]!.workflowDefinition.id,
      workflowRuntimeId: actionResult[0]!.workflowRuntimeData.id,
      ballerineEntityId: actionResult[0]!.ballerineEntityId,
    });
  }

  // POST /event
  @common.Post('/:id/event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async event(
    @UserData() _userInfo: UserInfo,
    @common.Param('id') id: string,
    @common.Body() data: WorkflowEventInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<void> {
    return await this.service.event(
      {
        ...data,
        id,
      },
      projectIds,
    );
  }

  // POST /event
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
  ): Promise<void> {
    return await this.service.event(
      {
        ...data,
        id,
      },
      projectIds,
    );
  }

  // curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/v1/external/workflows/:id/context
  @common.Get('/:id/context')
  @UseCustomerAuthGuard()
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getWorkflowRuntimeDataContext(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    try {
      const context = await this.service.getWorkflowRuntimeDataContext(id, projectIds);

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
  @VerifyUnifiedApiSignatureDecorator()
  async hook(
    @common.Param() params: WorkflowIdWithEventInput,
    @common.Query() query: WorkflowHookQuery,
    @common.Body() hookResponse: any,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<void> {
    try {
      const workflowRuntime = await this.service.getWorkflowRuntimeDataById(
        params.id,
        {},
        projectIds,
      );
      await this.normalizeService.handleHookResponse({
        workflowRuntime: workflowRuntime,
        data: hookResponse,
        resultDestinationPath: query.resultDestination || 'hookResponse',
        processName: query.processName,
        projectIds,
      });

      return await this.service.event(
        {
          id: params.id,
          name: params.event,
        },
        projectIds,
      );
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }

    return;
  }
}
