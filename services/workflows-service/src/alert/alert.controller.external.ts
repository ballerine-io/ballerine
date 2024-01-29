import * as common from '@nestjs/common';

import * as swagger from '@nestjs/swagger';
import { alertService } from '@/alert/alert.service';
import { alertCreateDto } from '@/alert/dtos/alert-create';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

import * as types from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import express from 'express';

@swagger.ApiTags('external/alerts')
@common.Controller('external/alerts')
export class alertControllerExternal {
  constructor(
    protected readonly service: alertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: alertCreateDto })
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() body: alertCreateDto,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    this.logger.log('create alert');
    const alert: alertCreateDto = {
      ...body,
      projectId: currentProjectId,
    };

    const createdalert = await this.service.create(alert);

    return createdalert;
  }

  @common.Get()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [alertCreateDto] })
  @swagger.ApiForbiddenResponse()
  async createBatch(
    @common.Body() body: alertCreateDto[],
    @common.Res() response: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const batchCreateResponse = await this.service.createBatch(body);
    if (batchCreateResponse.overallStatus === 'partial') {
      response.status(207);
    }

    response.json(batchCreateResponse.txCreationResponse);
  }
}
