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
import { GetUserStatsParams, RunnableWorkflowData } from './types';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { IntentResponse, WorkflowService } from './workflow.service';
import { Request, Response } from 'express';
import { WorkflowRunDto } from './dtos/workflow-run';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { UseKeyAuthInDevGuard } from '@/common/decorators/use-key-auth-in-dev-guard.decorator';
import { plainToClass } from 'class-transformer';
import { GetWorkflowsRuntimeInputDto } from '@/workflow/dtos/get-workflows-runtime-input.dto';
import { GetWorkflowsRuntimeOutputDto } from '@/workflow/dtos/get-workflows-runtime-output.dto';
import { WorkflowIdWithEventInput } from '@/workflow/dtos/workflow-id-with-event-input';
import { WorkflowWebhookInput } from '@/workflow/dtos/workflow-webhook-input';
import { WorkflowRuntimeStatsModel } from '@/workflow/workflow-runtime-stats-model';
import { WorkflowMetricService } from '@/workflow/workflow-metric.service';
import { WorkflowRuntimeAgentCasesModel } from '@/workflow/workflow-runtime-agent-cases.model';
import { GetWorkflowsRuntimeAgentCases } from '@/workflow/dtos/get-workflows-runtime-agent-cases-input.dto';
import { WorkflowRuntimeCasesPerStatusModel } from '@/workflow/workflow-runtime-cases-per-status.model';
import { GetWorkflowRuntimeUserStatsDto } from '@/workflow/dtos/get-workflow-runtime-user-stats-input.dto';
import { GetCaseResolvingMetricsDto } from '@/workflow/dtos/get-case-resolving-metrics-input.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@swagger.ApiBearerAuth()
@swagger.ApiTags('external/workflows')
@common.Controller('external/workflows')
export class WorkflowControllerExternal {
  constructor(
    protected readonly service: WorkflowService,
    protected readonly metricService: WorkflowMetricService,
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

  @common.Get('/metrics/workflows-definition-runtime-stats')
  @swagger.ApiOkResponse({ type: [WorkflowRuntimeStatsModel] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  async listWorkflowRuntimeStats(): Promise<WorkflowRuntimeStatsModel[]> {
    const results = await this.metricService.listWorkflowStats();

    return results.map(result => plainToClass(WorkflowRuntimeStatsModel, result));
  }

  @common.Get('/metrics/workflow-runtime-agent-cases-stats')
  @swagger.ApiOkResponse({ type: [WorkflowRuntimeAgentCasesModel] })
  @common.HttpCode(200)
  async listWorkflowRuntimeAgentCasesStats(
    @Query() query: GetWorkflowsRuntimeAgentCases,
  ): Promise<WorkflowRuntimeAgentCasesModel[]> {
    const results = await this.metricService.listWorkflowRuntimeAgentCasesStats({
      fromDate: query.fromDate,
    });

    return results.map(result => plainToClass(WorkflowRuntimeAgentCasesModel, result));
  }

  @common.Get('/metrics/workflow-runtime-cases-per-status')
  @swagger.ApiOkResponse({ type: WorkflowRuntimeCasesPerStatusModel })
  @common.HttpCode(200)
  async listWorkflowRuntimeCasesPerStatusStats(
    @Query() query: GetWorkflowsRuntimeAgentCases,
  ): Promise<WorkflowRuntimeCasesPerStatusModel> {
    const results = await this.metricService.getWorkflowsRuntimeCasesPerStatus({
      fromDate: query.fromDate,
    });
    return plainToClass(WorkflowRuntimeCasesPerStatusModel, results);
  }

  @common.Get('/metrics/user-stats')
  async listUserWorkflowRuntimeUserStats(
    @common.Request() request: Request,
    @common.Query() query: GetWorkflowRuntimeUserStatsDto,
  ) {
    const statsParams: GetUserStatsParams = {
      fromDate: query.fromDate,
    };

    const userId = request.user!.id;

    const [approvalRate, averageResolutionTime, averageAssignmentTime, averageReviewTime] =
      await Promise.all([
        this.service.getUserApprovalRate(userId),
        this.service.getAverageResolutionTime(userId, statsParams),
        this.service.getAverageAssignmentTime(userId, statsParams),
        this.service.getAverageReviewTime(userId, statsParams),
      ]);

    return {
      approvalRate,
      averageResolutionTime,
      averageAssignmentTime,
      averageReviewTime,
    };
  }

  @common.Get('/metrics/case-resolving')
  async listCaseResolvingMetric(
    @common.Request() request: Request,
    @common.Query() query: GetCaseResolvingMetricsDto,
  ) {
    const userId = request.user!.id;

    return await this.service.getResolvedCasesPerDay(userId, { fromDate: query.fromDate });
  }

  @common.Get('/workflow-definition/:id')
  @ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async getWorkflowDefinition(@common.Param() params: WorkflowDefinitionWhereUniqueInput) {
    return await this.service.getWorkflowDefinitionById(params.id);
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
      return await this.service.updateWorkflowRuntimeData(params.id, data);
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
    return await this.service.event({
      ...data,
      id,
    });
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
    return await this.service.event({
      ...data,
      id,
    });
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

  @common.Post('/:id/hook/:event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async hook(
    @common.Param() params: WorkflowIdWithEventInput,
    @common.Body() data: WorkflowWebhookInput,
  ): Promise<void> {
    try {
      const workflowRuntime = await this.service.getWorkflowRuntimeDataById(params.id);
      const updatedContext = { ...workflowRuntime.context, ...data.payload };
      await this.service.updateWorkflowRuntimeData(params.id, { context: updatedContext });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }

    return await this.service.event({
      id: params.id,
      name: params.event,
    });
  }
}
