import * as common from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionModel } from '@/transaction/transaction.model';
import { Transaction } from '@prisma/client';
import type { TProjectIds } from '@/types';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';

@swagger.ApiTags('internal/transactions')
@common.Controller('internal/transactions')
export class TransactionControllerInternal {
  constructor(protected readonly service: TransactionService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [TransactionModel] })
  @swagger.ApiForbiddenResponse()
  async find(@ProjectIds() projectIds: TProjectIds): Promise<Transaction | null> {
    const projectId = projectIds?.[0];
    if (!projectId) throw new NotFoundException('Transaction not found');

    return this.service.getByProjectId(projectId, {
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        faviconImageUri: true,
        country: true,
        language: true,
        transactionStatus: true,
      },
    });
  }
}
