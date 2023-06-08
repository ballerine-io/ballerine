/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as nestAccessControl from 'nest-access-control';
import { isRecordNotFoundError } from '../prisma/prisma.util';
import * as errors from '../errors';
import { WorkflowService } from './workflow.service';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowDefinitionWhereUniqueInput } from './dtos/workflow-where-unique-input';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { UserData } from '@/user/user-data.decorator';
import { UserInfo } from '@/user/user-info';
import { WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
import { RunnableWorkflowData } from './types';
import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { WorkflowDefinitionFindManyArgs } from './dtos/workflow-definition-find-many-args';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import { enrichWorkflowRuntimeData } from './enrich-workflow-runtime-data';
import { UseGuards } from '@nestjs/common';
import { WorkflowAssigneeGuard } from '@/auth/assignee-asigned-guard.service';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import console from "console";

@swagger.ApiTags('internal/workflows')
@common.Controller('internal/workflows')
export class WorkflowControllerInternal {
  constructor(
    protected readonly service: WorkflowService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createWorkflowDefinition(
    @UserData() userInfo: UserInfo,
    @common.Body() data: WorkflowDefinitionCreateDto,
  ) {
    return await this.service.createWorkflowDefinition(data);
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [WorkflowDefinitionModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(WorkflowDefinitionFindManyArgs)
  async listWorkflowDefinitions(
    @UserData() userInfo: UserInfo,
    @common.Req() request: Request,
  ): Promise<WorkflowDefinition[]> {
    const args = plainToClass(WorkflowDefinitionFindManyArgs, request.query);

    return await this.service.listWorkflowDefinitions(args);
  }

  @common.Get('/active-states')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async listActiveStates() {
    try {
      return await this.service.listActiveWorkflowsRuntimeStates();
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found`);
      }
      throw error;
    }
  }

  @common.Post('/:id/event')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async event(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowEventInput,
  ): Promise<void> {
    return await this.service.event({
      ...data,
      id: params.id,
    });
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getRunnableWorkflowDataById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
  ): Promise<RunnableWorkflowData | null> {
    const workflowRuntimeData = await this.service.getWorkflowRuntimeDataById(params.id);
    const workflowDefinition = await this.service.getWorkflowDefinitionById(
      workflowRuntimeData.workflowDefinitionId,
    );
    return {
      workflowDefinition,
      workflowRuntimeData: enrichWorkflowRuntimeData(workflowRuntimeData),
    };
  }

  // PATCH /workflows/:id
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseGuards(WorkflowAssigneeGuard)
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

  // PATCH /workflows/assign/:id
  @common.Patch('/assign/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async assignWorkflowById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowAssigneeId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.assignWorkflowToUser(params.id, data);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  @nestAccessControl.UseRoles({
    resource: 'Workflow',
    action: 'delete',
    possession: 'own',
  })
  @common.Delete('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async deleteWorkflowDefinitionById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
  ): Promise<WorkflowDefinition> {
    try {
      return await this.service.deleteWorkflowDefinitionById(params.id, {
        select: {
          id: true,
          name: true,
          version: true,

          definition: true,
          definitionType: true,
          backend: true,

          extensions: true,
          persistStates: true,
          submitStates: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }
}
