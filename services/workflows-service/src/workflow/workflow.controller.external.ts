/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserData } from '@/user/user-data.decorator';
import { UserInfo } from '@/user/user-info';
import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as common from '@nestjs/common';
import { NotFoundException, Query, Res } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { WorkflowRuntimeData } from '@prisma/client';
import * as nestAccessControl from 'nest-access-control';
import * as errors from '../errors';
import { IntentDto } from './dtos/intent';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowDefinitionUpdateInput } from './dtos/workflow-definition-update-input';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { WorkflowDefinitionWhereUniqueInput } from './dtos/workflow-where-unique-input';
import { RunnableWorkflowData } from './types';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { IntentResponse, WorkflowService } from './workflow.service';
import { Response } from 'express';
import { WorkflowRunDto } from './dtos/workflow-run';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { UseKeyAuthInDevGuard } from '@/common/decorators/use-key-auth-in-dev-guard.decorator';
import { plainToClass } from 'class-transformer';
import { GetWorkflowsRuntimeInputDto } from '@/workflow/dtos/get-workflows-runtime-input.dto';
import { GetWorkflowsRuntimeOutputDto } from '@/workflow/dtos/get-workflows-runtime-output.dto';
import axios from 'axios';

@swagger.ApiBearerAuth()
@swagger.ApiTags('external/workflows')
@common.Controller('external/workflows')
export class WorkflowControllerExternal {
  constructor(
    protected readonly service: WorkflowService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}
  // GET /workflows
  @common.Get('/')
  @swagger.ApiOkResponse({ type: [GetWorkflowsRuntimeOutputDto] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  @UseKeyAuthInDevGuard()
  async listWorkflowRuntimeData(
    @Query() query: GetWorkflowsRuntimeInputDto,
  ): Promise<GetWorkflowsRuntimeOutputDto> {
    const results = await this.service.listRuntimeData({
      page: query.page,
      size: query.limit,
      status: query.status,
      orderBy: query.orderBy,
      orderDirection: query.orderDirection,
    });

    return plainToClass(GetWorkflowsRuntimeOutputDto, results);
  }

  @common.Get('/metrics')
  @UseKeyAuthInDevGuard()
  async listWorkflowRuntimeMetric() {
    return await this.service.listWorkflowsMetrics();
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseKeyAuthInDevGuard()
  async getRunnableWorkflowDataById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
  ): Promise<RunnableWorkflowData> {
    const workflowRuntimeData = await this.service.getWorkflowRuntimeDataById(params.id);
    if (!workflowRuntimeData) {
      throw new NotFoundException(`No resource with id [${params.id}] was found`);
    }

    const workflowDefinition = await this.service.getWorkflowDefinitionById(
      workflowRuntimeData.workflowDefinitionId,
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
  @UseKeyAuthInDevGuard()
  async updateById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowDefinitionUpdateInput,
  ): Promise<WorkflowRuntimeData> {
    try {
      const updatedWorkflow = await this.service.updateWorkflowRuntimeData(params.id, data);
      const websocketServerNotifyUri = `http://localhost:3500/notify?type=workflows_list`;
      // todo is it important to await this?
      await axios.post(websocketServerNotifyUri);
      return updatedWorkflow;
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
  @UseKeyAuthInDevGuard()
  async intent(@common.Body() { intentName, entityId }: IntentDto): Promise<IntentResponse> {
    // Rename to intent or getRunnableWorkflowDataByIntent?
    const entityType = intentName === 'kycSignup' ? 'endUser' : 'business';
    return await this.service.resolveIntent(intentName, entityId, entityType);
  }

  @common.Post('/run')
  @swagger.ApiOkResponse()
  @UseKeyAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createWorkflowRuntimeData(
    @common.Body() body: WorkflowRunDto,
    @Res() res: Response,
  ): Promise<any> {
    const { workflowId, context, config } = body;
    const { entity } = context;

    if (!entity.id && !entity.ballerineEntityId)
      throw new common.BadRequestException('Entity id is required');

    const actionResult = await this.service.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: workflowId,
      context,
      config,
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
  ): Promise<void> {
    const createdEvent = await this.service.event({
      ...data,
      id,
    });
    const websocketServerNotifyUri = `http://localhost:3500/notify?type=workflows_list`;
    // todo is it important to await this?
    await axios.post(websocketServerNotifyUri);
    return createdEvent;
  }

  // POST /event
  @common.Post('/:id/send-event')
  @swagger.ApiOkResponse()
  @UseKeyAuthGuard()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async sendEvent(
    @UserData() _userInfo: UserInfo,
    @common.Param('id') id: string,
    @common.Body() data: WorkflowEventInput,
  ): Promise<void> {
    const createdEvent = await this.service.event({
      ...data,
      id,
    });
    const websocketServerNotifyUri = `http://localhost:3500/notify?type=workflows_list`;
    // todo is it important to await this?
    await axios.post(websocketServerNotifyUri);
    return createdEvent;
  }
  // curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/v1/external/workflows/:id/context
  @common.Get('/:id/context')
  @UseKeyAuthGuard()
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getWorkflowRuntimeDataContext(@common.Param('id') id: string) {
    try {
      const context = await this.service.getWorkflowRuntimeDataContext(id);

      return { context };
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new NotFoundException(`No resource was found for ${JSON.stringify(id)}`);
      }

      throw err;
    }
  }
}
