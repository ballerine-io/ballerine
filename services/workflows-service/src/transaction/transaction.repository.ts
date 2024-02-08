import { PrismaService } from '../prisma/prisma.service';
import { TransactionRecord, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId } from '@/types';
import { TransactionFilters } from './dtos/transaction.filters';
import { DateTimeFilter } from '@/common/query-filters/date-time-filter';

@Injectable()
export class TransactionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.TransactionRecordCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionRecordCreateArgs>,
  ): Promise<TransactionRecord> {
    // #TODO: Fix this
    const { projectId, businessId, endUserId, ...rest } = args.data;

    args = {
      ...args,
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
      },
    } as any;

    // if (businessId) {
    //   args.data.business = {
    //     connect: { id: businessId },
    //   } as any;
    // }

    // if (endUserId) {
    //   args.data.endUser = {
    //     connect: { id: endUserId },
    //   } as any;
    // }
    const res = await this.prisma.transactionRecord.create<T>(args);

    return res;
  }

  async findMany<T extends Prisma.TransactionRecordFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionRecordFindManyArgs>,
    projectId: TProjectId,
  ) {
    return await this.prisma.transactionRecord.findMany(
      this.scopeService.scopeFindMany(args, [projectId]),
    );
  }

  async findManyWithFilters(
    filters: TransactionFilters,
    projectId: string,
  ): Promise<TransactionRecord[]> {
    return this.prisma.transactionRecord.findMany({
      where: {
        projectId, //  Always restrict to project
        ...this.buildFilters(filters),
      },
    });
  }

  private buildFilters(filters: TransactionFilters): Prisma.TransactionRecordWhereInput {
    const whereClause: Prisma.TransactionRecordWhereInput = {};

    if (filters.businessId) {
      whereClause.businessId = filters.businessId;
    }

    if (filters.counterpartyId) {
      whereClause.OR = [
        { counterpartyOriginatorId: filters.counterpartyId },
        { counterpartyBeneficiaryId: filters.counterpartyId },
      ];
    }

    if (filters.startDate) {
      whereClause.transactionDate = {
        ...(whereClause.transactionDate as DateTimeFilter),
        gte: filters.startDate,
      };
    }
    if (filters.endDate) {
      whereClause.transactionDate = {
        ...(whereClause.transactionDate as DateTimeFilter),
        lte: filters.endDate,
      };
    }

    if (filters.paymentMethod) {
      whereClause.paymentMethod = filters.paymentMethod;
    }

    // Time filtering with client-provided UTC timestamps
    if (filters.timeValue && filters.timeUnit) {
      const now = new Date(); // UTC time by default
      let subtractValue = 0;

      switch (filters.timeUnit) {
        case 'minutes':
          subtractValue = filters.timeValue * 60 * 1000;
          break;
        case 'hours':
          subtractValue = filters.timeValue * 60 * 60 * 1000;
          break;
        case 'days':
          subtractValue = filters.timeValue * 24 * 60 * 60 * 1000;
          break;
        case 'months':
          now.setMonth(now.getMonth() - filters.timeValue);
          break;
        case 'years':
          now.setFullYear(now.getFullYear() - filters.timeValue);
          break;
      }

      const pastDate = new Date(now.getTime() - subtractValue);
      whereClause.transactionDate = { gte: pastDate };
    }

    return whereClause;
  }
}
