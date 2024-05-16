import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TProjectIds } from '@/types';
import { BusinessReportRepository } from '@/business-report/business-report.repository';
import { GetBusinessReportDto } from './dto/get-business-report.dto';
import { toPrismaOrderByGeneric } from '@/workflow/utils/toPrismaOrderBy';

@Injectable()
export class BusinessReportService {
  constructor(protected readonly businessReportRepository: BusinessReportRepository) {}

  async create<T extends Prisma.BusinessReportCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportCreateArgs>,
  ) {
    return await this.businessReportRepository.create(args);
  }

  async findMany<T extends Prisma.BusinessReportFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findMany(args, projectIds);
  }

  async upsert<T extends Prisma.BusinessReportUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportUpsertArgs>,
    projectIds: NonNullable<TProjectIds>,
  ) {
    if (!args.where.id) {
      return await this.businessReportRepository.create({ data: args.create });
    }

    await this.businessReportRepository.updateMany({
      where: {
        id: args.where.id,
        project: { id: { in: projectIds } },
      },
      data: args.update,
    });

    return await this.businessReportRepository.findFirstOrThrow(
      {
        where: {
          id: args.where.id,
        },
      },
      projectIds,
    );
  }

  async findFirstOrThrow<T extends Prisma.BusinessReportFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findFirstOrThrow(args, projectIds);
  }

  async findFirst<T extends Prisma.BusinessReportFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findFirst(args, projectIds);
  }

  async findManyWithFilters(
    getTransactionsParameters: GetBusinessReportDto,
    projectId: string,
    options?: Prisma.BusinessReportFindManyArgs,
  ) {
    const args: Prisma.BusinessReportFindManyArgs = {};

    if (getTransactionsParameters.page?.number && getTransactionsParameters.page?.size) {
      // Temporary fix for pagination (class transformer issue)
      const size = parseInt(getTransactionsParameters.page.size as unknown as string, 10);
      const number = parseInt(getTransactionsParameters.page.number as unknown as string, 10);

      args.take = size;
      args.skip = size * (number - 1);
    }

    if (getTransactionsParameters.orderBy) {
      args.orderBy = toPrismaOrderByGeneric(getTransactionsParameters.orderBy);
    }

    return await this.businessReportRepository.findMany(
      {
        ...options,
        where: {
          businessId: getTransactionsParameters.businessId,
        },
        ...args,
      },
      [projectId],
    );
  }
}
