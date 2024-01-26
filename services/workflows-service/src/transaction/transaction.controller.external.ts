import * as common from '@nestjs/common';

import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import { Transaction, Prisma } from '@prisma/client';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

import * as types from '@/types';
import { createDemoMockData } from '../../scripts/workflows/workflow-runtime';
import { PrismaService } from '@/prisma/prisma.service';

import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiTags('external/transactions')
@common.Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: [TransactionCreateDto] })
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() transactionCreateModel: TransactionCreateDto,
    @ProjectIds() projectIds: types.TProjectIds,
    @CurrentProject() currentProjectId: types.TProjectId,
  ) {

    const projectName = await this.prisma.project.findUnique({
      where: {
        id: currentProjectId,
      },
      select: {
        name: true,
      },
    });

    const transaction = {
      ...transactionCreateModel,
      transactionCorrelationId: 'some-correlation-id',
      project: currentProjectId,
      projects: {
        connect: currentProjectId,
      },
      transactionDate: new Date(), // Add this line
      transactionAmount: 100, // Add this line
      transactionCurrency: 'USD', // Add this line
    } as Prisma.TransactionCreateArgs['data'];

    const createdTransaction = (await this.service.create({
      data: transaction,
      select: {
        id: true,
      },
    })) as Transaction & { projects: { id: string }[] };

    // if (projectName == 'demo') {
    //   await createDemoMockData({
    //     prismaClient: this.prisma,
    //     transaction: transactionCreateModel,
    //     projects: createdTransaction.projects,
    //   });
    // }

    return createdTransaction;
  }
}
