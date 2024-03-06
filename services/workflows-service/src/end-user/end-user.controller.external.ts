import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import * as common from '@nestjs/common';
import { Param } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';

import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as errors from '../errors';
// import * as nestAccessControl from 'nest-access-control';
import { EndUserCreateDto } from './dtos/end-user-create';
import { EndUserFindManyArgs } from './dtos/end-user-find-many-args';
import { EndUserWhereUniqueInput } from './dtos/end-user-where-unique-input';
import { EndUserModel } from './end-user.model';
import { EndUserService } from './end-user.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { WorkflowDefinitionModel } from '@/workflow/workflow-definition.model';
import { WorkflowDefinitionFindManyArgs } from '@/workflow/dtos/workflow-definition-find-many-args';
import { WorkflowService } from '@/workflow/workflow.service';
import { makeFullWorkflow } from '@/workflow/utils/make-full-workflow';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiTags('external/end-users')
@common.Controller('external/end-users')
export class EndUserControllerExternal {
  constructor(
    protected readonly service: EndUserService,
    protected readonly workflowService: WorkflowService, // @nestAccessControl.InjectRolesBuilder() // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [EndUserModel] })
  @swagger.ApiForbiddenResponse()
  @UseCustomerAuthGuard()
  async create(
    @common.Body() data: EndUserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<Pick<EndUserModel, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>> {
    const endUser = await this.service.create({
      data: {
        ...data,
        correlationId: data.correlationId || randomUUID(),
        email: data.email || faker.internet.email(data.firstName, data.lastName),
        phone: data.phone || faker.phone.number('+##########'),
        dateOfBirth: data.dateOfBirth || faker.date.past(60),
        avatarUrl: data.avatarUrl || faker.image.avatar(),
        project: { connect: { id: currentProjectId } },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });

    return endUser;
  }

  @common.Post('/create-with-business')
  @UseCustomerAuthGuard()
  async createWithBusiness(
    @common.Body() data: EndUserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { companyName, ...endUserInfo } = data;
    const endUser = await this.service.createWithBusiness(
      {
        endUser: endUserInfo,
        business: { companyName: companyName, projectId: currentProjectId },
      },
      currentProjectId,
    );

    return {
      endUserId: endUser.id,
      businessId: endUser.businesses.at(-1)!.id,
    };
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [EndUserModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(EndUserFindManyArgs)
  async list(
    @common.Req() request: Request,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<EndUserModel[]> {
    const args = plainToClass(EndUserFindManyArgs, request.query);

    return this.service.list(args, projectIds);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: EndUserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  @UseCustomerAuthGuard()
  async getById(
    @common.Param() params: EndUserWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<EndUserModel | null> {
    try {
      const endUser = await this.service.getById(params.id, {}, projectIds);

      return endUser;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  // curl -v http://localhost:3000/api/v1/external/end-users/:endUserId/workflows
  @common.Get('/:endUserId/workflows')
  @swagger.ApiOkResponse({ type: [WorkflowDefinitionModel] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  @ApiNestedQuery(WorkflowDefinitionFindManyArgs)
  @UseCustomerAuthGuard()
  async listWorkflowRuntimeDataByEndUserId(
    @Param('endUserId') endUserId: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const workflowRuntimeDataWithDefinition =
      await this.workflowService.listFullWorkflowDataByUserId(
        {
          entityId: endUserId,
          entity: 'endUser',
        },
        projectIds,
      );

    //@ts-expect-error
    return makeFullWorkflow(workflowRuntimeDataWithDefinition);
  }
}
