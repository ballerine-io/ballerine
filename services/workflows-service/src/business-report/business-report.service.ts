import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TProjectIds } from '@/types';
import { BusinessReportRepository } from '@/business-report/business-report.repository';

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

  async findById<T extends Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>,
  ) {
    return await this.businessReportRepository.findById(id, projectIds, args);
  }

  async updateById(...args: Parameters<BusinessReportRepository['updateById']>) {
    return await this.businessReportRepository.updateById(...args);
  }

  async count(args: Parameters<BusinessReportRepository['count']>[0], projectIds: TProjectIds) {
    return await this.businessReportRepository.count(args, projectIds);
  }
}
