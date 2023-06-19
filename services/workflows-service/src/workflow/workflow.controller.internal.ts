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
import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import {
  FindWorkflowsListDto,
  FindWorkflowsListLogicSchema,
  FindWorkflowsListSchema,
} from '@/workflow/dtos/find-workflows-list.dto';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { UsePipes, UseGuards } from '@nestjs/common';
import { FilterService } from '@/filter/filter.service';
import {
  FindWorkflowParamsDto,
  FindWorkflowQueryDto,
  FindWorkflowQuerySchema,
} from '@/workflow/dtos/find-workflow.dto';
import { WorkflowAssigneeGuard } from '@/auth/assignee-asigned-guard.service';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';

@swagger.ApiTags('internal/workflows')
@common.Controller('internal/workflows')
export class WorkflowControllerInternal {
  constructor(
    protected readonly service: WorkflowService,
    protected readonly filterService: FilterService,
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
  @swagger.ApiOkResponse()
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @ApiNestedQuery(FindWorkflowsListDto)
  @UsePipes(new ZodValidationPipe(FindWorkflowsListSchema, 'query'))
  async listWorkflowRuntimeData(
    @common.Query() { filterId, page, filter: filters, ...queryParams }: FindWorkflowsListDto,
  ) {
    const filter = await this.filterService.getById(filterId);

    const entityType = filter.entity as 'individuals' | 'businesses';

    const { orderBy } = FindWorkflowsListLogicSchema[entityType].parse(queryParams);

    return await this.service.listWorkflowRuntimeDataWithRelations({
      args: filter.query as any,
      entityType,
      orderBy,
      page,
      filters,
    });
  }

  @common.Get('/:id')
  @swagger.ApiOkResponse()
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @ApiNestedQuery(FindWorkflowQueryDto)
  @UsePipes(new ZodValidationPipe(FindWorkflowQuerySchema, 'query'))
  async getRunnableWorkflowDataById(
    @common.Param() { id }: FindWorkflowParamsDto,
    @common.Query() { filterId }: FindWorkflowQueryDto,
  ) {
    const filter = await this.filterService.getById(filterId);

    return await this.service.getWorkflowByIdWithRelations(id, filter.query as any);
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
