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

  async findFirst<T extends Prisma.BusinessReportFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findFirst(args, projectIds);
  }
}
