import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { FilterService } from '@/filter/filter.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectId, TProjectIds } from '@/types';
import { DocumentDecisionParamsInput } from '@/workflow/dtos/document-decision-params-input';
import { DocumentDecisionUpdateQueryInput } from '@/workflow/dtos/document-decision-query.input';
import { DocumentDecisionUpdateInput } from '@/workflow/dtos/document-decision-update-input';
import { DocumentUpdateQueryInput } from '@/workflow/dtos/document-update-query-input';
import {
  FindWorkflowParamsDto,
  FindWorkflowQueryDto,
  FindWorkflowQuerySchema,
} from '@/workflow/dtos/find-workflow.dto';
import {
  FindWorkflowsListDto,
  FindWorkflowsListLogicSchema,
  FindWorkflowsListSchema,
} from '@/workflow/dtos/find-workflows-list.dto';
import { WorkflowAssigneeId } from '@/workflow/dtos/workflow-assignee-id';
import { WorkflowDefinitionCloneDto } from '@/workflow/dtos/workflow-definition-clone';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import { WorkflowEventDecisionInput } from '@/workflow/dtos/workflow-event-decision-input';
import * as common from '@nestjs/common';
import { UseGuards, UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
// import * as nestAccessControl from 'nest-access-control';
import * as errors from '../errors';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { DocumentUpdateParamsInput } from './dtos/document-update-params-input';
import { DocumentUpdateInput } from './dtos/document-update-update-input';
import { EmitSystemBodyInput, EmitSystemParamInput } from './dtos/emit-system-event-input';
import { WorkflowDefinitionCreateDto } from './dtos/workflow-definition-create';
import { WorkflowEventInput } from './dtos/workflow-event-input';
import { WorkflowDefinitionWhereUniqueInput } from './dtos/workflow-where-unique-input';
import { WorkflowDefinitionModel } from './workflow-definition.model';
import { WorkflowService } from './workflow.service';
import { WorkflowAssigneeGuard } from '@/auth/assignee-asigned-guard.service';
import { FilterQuery } from '@/workflow/types';

@swagger.ApiExcludeController()
@common.Controller('internal/workflows')
export class WorkflowControllerInternal {
  constructor(
    protected readonly service: WorkflowService,
    protected readonly filterService: FilterService,
    // @nestAccessControl.InjectRolesBuilder()
    // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createWorkflowDefinition(@common.Body() data: WorkflowDefinitionCreateDto) {
    return await this.service.createWorkflowDefinition(data);
  }

  @common.Post('/clone')
  @swagger.ApiCreatedResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async cloneWorkflowDefinition(
    @common.Body() data: WorkflowDefinitionCloneDto,
    @CurrentProject() currentProject: TProjectId,
  ) {
    return await this.service.cloneWorkflowDefinition(data, currentProject);
  }

  @common.Get()
  @swagger.ApiOkResponse()
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @ApiNestedQuery(FindWorkflowsListDto)
  @UsePipes(new ZodValidationPipe(FindWorkflowsListSchema, 'query'))
  async listWorkflowRuntimeData(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query()
    { filterId, page, search, filter: filters, ...queryParams }: FindWorkflowsListDto,
  ) {
    const filter = await this.filterService.getById(filterId, {}, projectIds);

    const entityType = filter.entity as 'individuals' | 'businesses';

    const { orderBy } = FindWorkflowsListLogicSchema[entityType].parse(queryParams);

    return await this.service.listWorkflowRuntimeDataWithRelations(
      {
        args: filter.query as FilterQuery,
        entityType,
        orderBy,
        page,
        filters,
        search,
      },
      projectIds,
    );
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
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const filter = await this.filterService.getById(filterId, {}, projectIds);

    return await this.service.getWorkflowByIdWithRelations(id, filter.query as any, projectIds);
  }

  @common.Get('/active-states')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async listActiveStates(@ProjectIds() projectIds: TProjectIds) {
    try {
      return await this.service.listActiveWorkflowsRuntimeStates(projectIds);
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
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<void> {
    await this.service.event(
      {
        ...data,
        id: params.id,
      },
      projectIds,
      currentProjectId,
    );
  }

  // PATCH /workflows/:id/event-decision
  @common.Patch('/:id/event-decision')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseGuards(WorkflowAssigneeGuard)
  async updateDecisionAndSendEventById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowEventDecisionInput,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return this.service.updateDecisionAndSendEvent({
        id: params?.id,
        name: data?.name,
        reason: data?.reason,
        projectId: currentProjectId,
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
  @UseGuards(WorkflowAssigneeGuard)
  async updateById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @common.Body() data: WorkflowDefinitionUpdateInput,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.updateWorkflowRuntimeData(params.id, data, currentProjectId);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw error;
    }
  }

  @common.Patch(':id/documents/:documentId')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseGuards(WorkflowAssigneeGuard)
  async updateDocumentPropertiesById(
    @common.Param() params: DocumentUpdateParamsInput,
    @common.Body() data: DocumentUpdateInput,
    @CurrentProject() currentProjectId: TProjectId,
    @common.Query() query: DocumentUpdateQueryInput,
  ) {
    return await this.service.updateDocumentById(
      {
        workflowId: params?.id,
        documentId: params?.documentId,
        validateDocumentSchema: false,
        documentsUpdateContextMethod: query.contextUpdateMethod,
      },
      data.document,
      currentProjectId,
    );
  }

  @common.Post(':id/system-event')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseGuards(AdminAuthGuard)
  async emitWorkflowEvent(
    @common.Param() params: EmitSystemParamInput,
    @common.Body() data: EmitSystemBodyInput,
  ) {
    if (data.systemEventName !== 'workflow.context.changed') {
      throw new common.BadRequestException(`Invalid system event name: ${data.systemEventName}`);
    }

    return await this.service.emitSystemWorkflowEvent({
      workflowRuntimeId: params.id,
      projectId: data.projectId,
      systemEventName: data.systemEventName as 'workflow.context.changed',
    });
  }

  // PATCH /workflows/:workflowId/decision/:documentId
  @common.Patch('/:id/decision/:documentId')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @UseGuards(WorkflowAssigneeGuard)
  async updateDocumentDecisionById(
    @common.Param() params: DocumentDecisionParamsInput,
    @common.Body() data: DocumentDecisionUpdateInput,
    @common.Query() query: DocumentDecisionUpdateQueryInput,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.updateDocumentDecisionById(
        {
          workflowId: params?.id,
          documentId: params?.documentId,
          documentsUpdateContextMethod: query.contextUpdateMethod,
        },
        {
          status: data?.decision,
          reason: data?.reason,
        },
        projectIds,
        currentProjectId,
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
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<WorkflowRuntimeData> {
    try {
      return await this.service.assignWorkflowToUser(params.id, data, projectIds, currentProjectId);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw error;
    }
  }

  // @nestAccessControl.UseRoles({
  //   resource: 'Workflow',
  //   action: 'delete',
  //   possession: 'own',
  // })
  @common.Delete('/:id')
  @swagger.ApiOkResponse({ type: WorkflowDefinitionModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async deleteWorkflowDefinitionById(
    @common.Param() params: WorkflowDefinitionWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    try {
      return await this.service.deleteWorkflowDefinitionById(
        params.id,
        {
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
        },
        projectIds,
      );
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw error;
    }
  }
}
