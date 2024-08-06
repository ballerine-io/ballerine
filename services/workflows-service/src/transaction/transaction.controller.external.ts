import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import {
  TransactionCreateAltDto,
  TransactionCreateAltDtoWrapper,
  TransactionCreateDto,
} from '@/transaction/dtos/transaction-create.dto';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

import * as types from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import express from 'express';
import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  GetTransactionsByAlertDto,
  GetTransactionsDto,
} from '@/transaction/dtos/get-transactions.dto';
import { PaymentMethod } from '@prisma/client';
import { BulkTransactionsCreatedDto } from '@/transaction/dtos/bulk-transactions-created.dto';
import { TransactionCreatedDto } from '@/transaction/dtos/transaction-created.dto';
import { BulkStatus } from '@/alert/types';
import * as errors from '@/errors';
import { exceptionValidationFactory } from '@/errors';
import { TIME_UNITS } from '@/data-analytics/consts';
import { TransactionEntityMapper } from './transaction.mapper';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';
import { InlineRule, TimeUnit } from '@/data-analytics/types';
import { AlertRepository } from '@/alert/alert.repository';
import { ProjectScopeService } from '@/project/project-scope.service';

//add swagger auth
@swagger.ApiBearerAuth()
@swagger.ApiTags('Transactions')
@Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly scopeService: ProjectScopeService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
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
    enum: Object.values(TIME_UNITS),
    description: 'The time unit used in conjunction with timeValue',
    required: false,
  })
  async getTransactions(
    @Query() getTransactionsParameters: GetTransactionsDto,
    @CurrentProject() projectId: types.TProjectId,
  ) {
    return this.service.getTransactions(getTransactionsParameters, projectId, {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get()
  @UseGuards(CustomerAuthGuard)
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
    enum: Object.values(TIME_UNITS),
    description: 'The time unit used in conjunction with timeValue',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'alertId',
    description: 'Filter by alert ID.',
    required: true,
  })
  async getTransactionsByAlert(
    @Query() getTransactionsByAlertParameters: GetTransactionsByAlertDto,
    @CurrentProject() projectId: types.TProjectId,
  ) {
    const queryArgs = this.scopeService.scopeFindOne(
      {
        include: {
          alertDefinition: true,
        },
        where: {
          id: getTransactionsByAlertParameters.alertId,
        },
      },
      [projectId],
    );

    const alert = await this.prisma.alert.findUnique(queryArgs);

    if (!alert) {
      throw new errors.NotFoundException(
        `Alert with id ${getTransactionsByAlertParameters.alertId} not found`,
      );
    }

    let filters: GetTransactionsByAlertDto = {
      ...getTransactionsByAlertParameters,
    };

    if (!alert.alertDefinition) {
      throw new errors.NotFoundException(`Alert definition not found for alert ${alert.id}`);
    }
    const inlineRule = alert.alertDefinition.inlineRule as InlineRule;

    if (!inlineRule || !inlineRule.options) {
      return filters;
    }
    if (!filters.endDate) {
      filters.endDate = alert.updatedAt;
    } else if (
      !filters.startDate &&
      (inlineRule.fnName === 'evaluateMerchantGroupAverage' ||
        inlineRule.fnName === 'evaluateHighTransactionTypePercentage' ||
        inlineRule.fnName === 'evaluateTransactionsAgainstDynamicRules' ||
        inlineRule.fnName === 'evaluateMultipleMerchantsOneCounterparty' ||
        inlineRule.fnName === 'evaluateDormantAccount')
    ) {
      const { timeAmount, timeUnit } = inlineRule.options;

      filters.endDate = alert.updatedAt;

      const _untilDate = new Date(filters.endDate);

      let subtractValue = 0;

      const baseSubstractByMin = timeAmount * 60 * 1000;

      switch (timeUnit) {
        case TIME_UNITS.minutes:
          subtractValue = baseSubstractByMin;
          break;
        case TIME_UNITS.hours:
          subtractValue = 60 * baseSubstractByMin;
          break;
        case TIME_UNITS.days:
          subtractValue = 24 * 60 * baseSubstractByMin;
          break;
        case TIME_UNITS.months:
          _untilDate.setMonth(_untilDate.getMonth() - timeAmount);
          break;
        case TIME_UNITS.years:
          _untilDate.setFullYear(_untilDate.getFullYear() - timeAmount);
          break;
      }

      _untilDate.setHours(0, 0, 0, 0);

      filters.startDate = new Date(_untilDate.getTime() - subtractValue);
    }

    return this.service.getTransactions(filters, projectId, {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
