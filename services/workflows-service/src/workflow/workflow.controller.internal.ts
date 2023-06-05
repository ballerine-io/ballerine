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
import { Business, EndUser, WorkflowDefinition, WorkflowRuntimeData } from '@prisma/client';
import { RunnableWorkflowData } from './types';
import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import { WorkflowDefinitionUpdateInput } from '@/workflow/dtos/workflow-definition-update-input';
import { enrichWorkflowRuntimeData } from './enrich-workflow-runtime-data';
import {
  FindWorkflowsListDto,
  FindWorkflowsListSchema,
} from '@/workflow/dtos/find-workflows-list.dto';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { UsePipes } from '@nestjs/common';
import { FilterService } from '@/filter/filter.service';
import { getDocumentId } from '@/workflow/utils';
import { DefaultContextSchema } from '@/workflow/schemas/context';
import { certificateOfResidenceGH } from '@/schemas/documents/GH';

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

  // @TODO: Refactor. Should return WorkflowRuntimeData. Should support filters.
  @common.Get()
  @swagger.ApiOkResponse() // @TODO: Swagger
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(FindWorkflowsListDto)
  @UsePipes(new ZodValidationPipe(FindWorkflowsListSchema))
  async list(@common.Query() { filterId }: FindWorkflowsListDto) {
    const filter = await this.filterService.getById(filterId);

    // @TODO: Move the logic to the service
    type WorkflowWithRelations = WorkflowRuntimeData & {
      workflowDefinition: WorkflowDefinition;
    } & ({ endUser: EndUser } | { business: Business });

    const workflows = (await this.service.listWorkflowRuntimeData(
      filter.query as any,
    )) as WorkflowWithRelations[];

    return workflows.map(workflow => {
      const isIndividuals = 'endUser' in workflow;

      return {
        ...workflow,
        context: {
          ...workflow.context,
          documents: workflow.context?.documents?.map(
            (document: DefaultContextSchema['documents'][number]) => ({
              ...document,
              id: getDocumentId(document),
              propertiesSchema: certificateOfResidenceGH.propertiesSchema,
            }),
          ),
        },
        entity: {
          id: isIndividuals ? workflow.endUser.id : workflow.business.id,
          name: isIndividuals
            ? `${String(workflow.endUser.firstName)} ${String(workflow.endUser.lastName)}`
            : workflow.business.companyName,
          avatarUrl: isIndividuals ? workflow.endUser.avatarUrl : null,
          approvalState: isIndividuals
            ? workflow.endUser.approvalState
            : workflow.business.approvalState,
        },
        endUser: undefined,
        business: undefined,
      };
    });
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
  ): Promise<WorkflowDefinitionModel | null> {
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
