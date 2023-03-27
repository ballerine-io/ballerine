/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UserData } from '@/user/user-data.decorator';
import { UserInfo } from '@/user/user-info';
import { ApiNestedQuery } from '@/decorators/api-nested-query.decorator';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import * as common from '@nestjs/common';
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
import { Headers } from '@nestjs/common';

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
  @common.Get()
  @swagger.ApiOkResponse({ type: [WorkflowDefinitionModel] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  @ApiNestedQuery(WorkflowDefinitionFindManyArgs)
  async listWorkflowRuntimeDataByUserId(
    @UserData()
    userInfo: UserInfo,
    @Headers() headers: any,
  ): Promise<RunnableWorkflowData[]> {
    const completeWorkflowData = await this.service.listFullWorkflowDataByUserId(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      headers.no_auth_user_id,
    );
    const response = completeWorkflowData.map(({ workflowDefinition, ...workflowRuntimeData }) => ({
      workflowRuntimeData,
      workflowDefinition,
    }));

    return response;
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getRunnableWorkflowDataById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
  ): Promise<RunnableWorkflowData> {
    const workflowRuntimeData = await this.service.getWorkflowRuntimeDataById(params.id);
    const workflowDefinition = await this.service.getWorkflowDefinitionById(
      workflowRuntimeData.workflowDefinitionId,
    );

    return {
      workflowDefinition,
      workflowRuntimeData,
    };
  }

  // PUT /workflows/:id
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
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
  async intent(@common.Body() intent: IntentDto, @Headers() headers: any): Promise<IntentResponse> {
    // Rename to intent or getRunnableWorkflowDataByIntent?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return await this.service.resolveIntent(intent.intentName, headers.no_auth_user_id);
  }

  // POST /event
  @common.Post('/:id/event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async event(
    @UserData() userInfo: UserInfo,
    @common.Param('id') id: string,
    @common.Body() data: WorkflowEventInput,
  ): Promise<void> {
    return await this.service.event({
      ...data,
      id,
    });
  }
}
