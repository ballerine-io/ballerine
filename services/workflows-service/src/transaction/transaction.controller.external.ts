import * as common from '@nestjs/common';

import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

import * as types from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import express from 'express';

@swagger.ApiTags('external/transactions')
@common.Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: TransactionCreateDto })
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() body: TransactionCreateDto,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    this.logger.log('create transaction');
    const transaction: TransactionCreateDto = {
      ...body,
      projectId: currentProjectId,
    };

    const createdTransaction = await this.service.create(transaction);

    return createdTransaction;
  }

  @common.Post('/batch')
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [TransactionCreateDto] })
  @swagger.ApiForbiddenResponse()
  async createBatch(
    @common.Body() body: TransactionCreateDto[],
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
