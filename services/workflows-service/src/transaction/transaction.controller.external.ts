import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { buildPaginationFilter } from '@/common/dto';
import {
  TransactionCreateAltDto,
  TransactionCreateAltDtoWrapper,
  TransactionCreateDto,
} from '@/transaction/dtos/transaction-create.dto';
import { TransactionService } from '@/transaction/transaction.service';
import * as swagger from '@nestjs/swagger';

import { PrismaService } from '@/prisma/prisma.service';
import * as types from '@/types';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';

import { AlertService } from '@/alert/alert.service';
import { BulkStatus } from '@/alert/types';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { InlineRule } from '@/data-analytics/types';
import * as errors from '@/errors';
import { exceptionValidationFactory } from '@/errors';
import { ProjectScopeService } from '@/project/project-scope.service';
import { BulkTransactionsCreatedDto } from '@/transaction/dtos/bulk-transactions-created.dto';
import { GetTransactionsByAlertDto } from '@/transaction/dtos/get-transactions.dto';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';
import { TransactionEntityMapper } from './transaction.mapper';
import { Prisma } from '@prisma/client';
import { toPrismaOrderByGeneric } from '@/workflow/utils/toPrismaOrderBy';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Transactions')
@Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly dataAnalyticsService: DataAnalyticsService,
    protected readonly scopeService: ProjectScopeService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly alertService: AlertService,
  ) {}

  @Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: TransactionCreatedDto })
  @swagger.ApiForbiddenResponse()
  async create(
    @Body(
      new ValidationPipe({
        exceptionFactory: exceptionValidationFactory,
      }),
    )
    body: TransactionCreateDto,
    @Res() res: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const creationResponses = await this.service.createBulk({
      transactionsPayload: [body],
      projectId: currentProjectId,
    });
    const creationResponse = creationResponses[0]!;

    res.status(201).json(creationResponse);
  }

  @Post('/alt')
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: TransactionCreateAltDto })
  @swagger.ApiForbiddenResponse()
  async createAlt(
    @Body(
      new ValidationPipe({
        exceptionFactory: exceptionValidationFactory,
      }),
    )
    body: TransactionCreateAltDtoWrapper,
    @Res() res: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const tranformedPayload = TransactionEntityMapper.altDtoToOriginalDto(body.data);
    const creationResponses = await this.service.createBulk({
      transactionsPayload: [tranformedPayload],
      projectId: currentProjectId,
    });
    const creationResponse = creationResponses[0]!;

    res.status(201).json(creationResponse);
  }

  @Post('/alt/bulk')
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [BulkTransactionsCreatedDto] })
  @swagger.ApiResponse({ type: [BulkTransactionsCreatedDto], status: 207 })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @swagger.ApiBody({ type: () => [TransactionCreateAltDto] })
  async createAltBulk(
    @Body(
      new ParseArrayPipe({
        items: TransactionCreateAltDtoWrapper,
        exceptionFactory: exceptionValidationFactory,
      }),
    )
    body: TransactionCreateAltDtoWrapper[],
    @Res() res: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const tranformedPayload = body.map(({ data }) =>
      TransactionEntityMapper.altDtoToOriginalDto(data),
    );
    const creationResponses = await this.service.createBulk({
      transactionsPayload: tranformedPayload,
      projectId: currentProjectId,
    });

    let hasErrors = false;

    const response = creationResponses.map(creationResponse => {
      if ('errorMessage' in creationResponse) {
        hasErrors = true;

        return {
          status: BulkStatus.FAILED,
          error: creationResponse.errorMessage,
          data: {
            correlationId: creationResponse.correlationId,
          },
        };
      }

      return {
        status: BulkStatus.SUCCESS,
        data: creationResponse,
      };
    });

    res.status(hasErrors ? 207 : 201).json(response);
  }

  @Post('/bulk')
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [BulkTransactionsCreatedDto] })
  @swagger.ApiResponse({ type: [BulkTransactionsCreatedDto], status: 207 })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @swagger.ApiBody({ type: () => [TransactionCreateDto] })
  async createBulk(
    @Body(
      new ParseArrayPipe({
        items: TransactionCreateDto,
        exceptionFactory: exceptionValidationFactory,
      }),
    )
    body: TransactionCreateDto[],
    @Res() res: express.Response,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {
    const creationResponses = await this.service.createBulk({
      transactionsPayload: body,
      projectId: currentProjectId,
    });

    let hasErrors = false;

    const response = creationResponses.map(creationResponse => {
      if ('errorMessage' in creationResponse) {
        hasErrors = true;

        return {
          status: BulkStatus.FAILED,
          error: creationResponse.errorMessage,
          data: {
            correlationId: creationResponse.correlationId,
          },
        };
      }

      return {
        status: BulkStatus.SUCCESS,
        data: creationResponse,
      };
    });

    res.status(hasErrors ? 207 : 201).json(response);
  }

  @Get('/by-alert')
  @swagger.ApiOkResponse({ description: 'Returns an array of transactions.' })
  @swagger.ApiQuery({
    name: 'alertId',
    description: 'Filter by alert ID.',
    required: true,
  })
  async getTransactionsByAlert(
    @Query() byAlertFilters: GetTransactionsByAlertDto,
    @CurrentProject() projectId: types.TProjectId,
  ) {
    const alert = await this.alertService.getAlertWithDefinition(byAlertFilters.alertId, projectId);

    if (!alert) {
      throw new errors.NotFoundException(`Alert with id ${byAlertFilters.alertId} not found`);
    }

    if (!alert.alertDefinition) {
      throw new errors.NotFoundException(`Alert definition not found for alert ${alert.id}`);
    }

    return this.service.getTransactions(projectId, {
      where:
        alert.executionDetails.filters ||
        this.dataAnalyticsService.getInvestigationFilter(
          projectId,
          alert.alertDefinition.inlineRule as InlineRule,
          alert.executionDetails.subjects,
        ),
      include: {
        counterpartyBeneficiary: {
          select: {
            correlationId: true,
            business: {
              select: {
                correlationId: true,
                companyName: true,
              },
            },
            endUser: {
              select: {
                correlationId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        counterpartyOriginator: {
          select: {
            correlationId: true,
            business: {
              select: {
                correlationId: true,
                companyName: true,
              },
            },
            endUser: {
              select: {
                correlationId: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      ...buildPaginationFilter(byAlertFilters.page),
      ...(byAlertFilters.orderBy
        ? { orderBy: toPrismaOrderByGeneric(byAlertFilters.orderBy) }
        : {
            orderBy: {
              transactionDate: 'desc',
            },
          }),
    });
  }
}
