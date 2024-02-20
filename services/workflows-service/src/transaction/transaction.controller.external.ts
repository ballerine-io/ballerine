import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create.dto';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

import * as types from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import express from 'express';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { GetTransactionsDto } from '@/transaction/dtos/get-transactions.dto';
import { PaymentMethod } from '@prisma/client';

@swagger.ApiTags('Transactions')
@Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}

  @Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: TransactionCreateDto })
  @swagger.ApiForbiddenResponse()
  async create(
    @Body() body: TransactionCreateDto,
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

  @Post('/batch')
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [TransactionCreateDto] })
  @swagger.ApiForbiddenResponse()
  async createBatch(
    @Body() body: TransactionCreateDto[],
    @Res() response: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const batchCreateResponse = await this.service.createBatch(body);
    if (batchCreateResponse.overallStatus === 'partial') {
      response.status(207);
    }

    response.json(batchCreateResponse.txCreationResponse);
  }

  @Get()
  // @UseGuards(CustomerAuthGuard)
  @swagger.ApiOkResponse({ description: 'Returns an array of transactions.' })
  @swagger.ApiQuery({ name: 'businessId', description: 'Filter by business ID.', required: false })
  @swagger.ApiQuery({
    name: 'counterpartyId',
    description: 'Filter by counterparty ID.',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'startDate',
    type: Date,
    description: 'Filter by transactions after or on this date.',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'endDate',
    type: Date,
    description: 'Filter by transactions before or on this date.',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'paymentMethod',
    description: 'Filter by payment method.',
    required: false,
    enum: PaymentMethod,
  })
  @swagger.ApiQuery({
    name: 'timeValue',
    type: 'number',
    description: 'Number of time units to filter on',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'timeUnit',
    type: 'enum',
    enum: ['minutes', 'hours', 'days', 'months', 'years'],
    description: 'The time unit used in conjunction with timeValue',
    required: false,
  })
  async getTransactions(
    @Query() getTransactionsParameters: GetTransactionsDto,
    @CurrentProject() projectId: types.TProjectId,
  ) {
    return this.service.getTransactions(getTransactionsParameters, projectId, {
      include: {
        Business: {
          select: {
            companyName: true,
          },
        },
        counterpartyOriginator: {
          select: {
            endUser: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}
