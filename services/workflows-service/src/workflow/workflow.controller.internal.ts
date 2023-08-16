/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as common from '@nestjs/common';
import { UseGuards, UsePipes } from '@nestjs/common';
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
import { FilterService } from '@/filter/filter.service';
import {
  FindWorkflowParamsDto,
  FindWorkflowQueryDto,
  FindWorkflowQuerySchema,
} from '@/workflow/dtos/find-workflow.dto';
import { WorkflowAssigneeGuard } from '@/auth/assignee-asigned-guard.service';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import { UseKeyAuthInDevGuard } from '@/common/decorators/use-key-auth-in-dev-guard.decorator';
import { WorkflowEventDecisionInput } from '@/workflow/dtos/workflow-event-decision-input';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { DocumentDecisionUpdateInput } from '@/workflow/dtos/document-decision-update-input';
import { DocumentDecisionParamsInput } from '@/workflow/dtos/document-decision-params-input';

@swagger.ApiTags('internal/workflows')
@common.Controller('internal/workflows')
export class WorkflowControllerInternal {
  constructor(
    protected readonly service: WorkflowService,
    protected readonly filterService: FilterService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
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
    @ProjectIds() projectIds: TProjectIds,
    @common.Query() { filterId, page, filter: filters, ...queryParams }: FindWorkflowsListDto,
  ) {
    const filter = await this.filterService.getById(
      filterId,
      this.scopeService.scopeFindOne({}, projectIds),
    );

    const entityType = filter.entity as 'individuals' | 'businesses';

    const { orderBy } = FindWorkflowsListLogicSchema[entityType].parse(queryParams);

    return await this.service.listWorkflowRuntimeDataWithRelations({
      args: filter.query as any,
      entityType,
      orderBy,
      page,
      filters,
      projectIds,
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
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<void> {
    return await this.service.event(
      {
        ...data,
        id: params.id,
      },
      projectIds,
    );
  }

  // PATCH /workflows/:id/event-decision
  @common.Patch('/:id/event-decision')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseKeyAuthInDevGuard()
  @UseGuards(WorkflowAssigneeGuard)
  async updateDecisionAndSendEventById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowEventDecisionInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeData> {
    try {
      return this.service.updateDecisionAndSendEvent({
        id: params?.id,
        name: data?.name,
        reason: data?.reason,
        projectIds,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  // PATCH /workflows/:id
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseKeyAuthInDevGuard()
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

  // PATCH /workflows/:workflowId/decision/:documentId
  @common.Patch('/:id/decision/:documentId')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseKeyAuthInDevGuard()
  @UseGuards(WorkflowAssigneeGuard)
  async updateDocumentDecisionById(
    @common.Param() params: DocumentDecisionParamsInput,
    @common.Body() data: DocumentDecisionUpdateInput,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.updateDocumentDecisionById(
        {
          workflowId: params?.id,
          documentId: params?.documentId,
        },
        {
          status: data?.decision,
          reason: data?.reason,
        },
      );
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }
      throw error;
    }
  }

  // PATCH /workflows/assign/:id
  // curl -X PATCH http://localhost:3000/api/v1/internal/workflows/assign/:workflowId \
  // -H 'Content-Type: application/json' \
  // -H 'Cookie: session=[SESSION]; session.sig=[SESSION_SIG]' \
  // -d '{"assigneeId": "[ASSIGNEE_ID]"}'
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
