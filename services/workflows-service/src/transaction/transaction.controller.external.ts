import * as common from '@nestjs/common';
import { Request, UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import { Transaction, Prisma } from '@prisma/client';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { TransactionModel } from '@/transaction/transaction.model';
import { AuthenticatedEntity } from '@/types';
import { TransactionAuthGuard } from '@/common/guards/transaction-auth.guard';
import { createDemoMockData } from '../../scripts/workflows/workflow-runtime';
import { PrismaService } from '@/prisma/prisma.service';

@swagger.ApiTags('external/transactions')
@common.Controller('external/transactions')
export class TransactionControllerExternal {
  constructor(
    protected readonly service: TransactionService,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Post()
  @UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({ type: [TransactionCreateDto] })
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() transactionCreateModel: TransactionCreateDto) {
    const { projectName, ...transaction } = transactionCreateModel;
    if (projectName) {
      (transaction as Prisma.TransactionCreateInput).projects = {
        create: { name: transactionCreateModel.projectName! },
      };
    }

    const createdTransaction = (await this.service.create({
      data: transaction,
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        faviconImageUri: true,
        country: true,
        language: true,
        transactionStatus: true,
        projects: true,
      },
    })) as Transaction & { projects: { id: string }[] };

    if (projectName == 'demo') {
      await createDemoMockData({
        prismaClient: this.prisma,
        transaction: transactionCreateModel,
        projects: createdTransaction.projects,
      });
    }

    return createdTransaction;
  }

  @common.Get('/me')
  @UseGuards(TransactionAuthGuard)
  @swagger.ApiOkResponse({ type: [TransactionModel] })
  @swagger.ApiForbiddenResponse()
  find(@Request() req: any): Partial<Transaction> {
    return (req.user as AuthenticatedEntity).transaction!;
  }
}
