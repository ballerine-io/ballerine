import { Injectable } from '@nestjs/common';
import { DataAnalyticsRepository } from './data-analytics.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DataAnalyticsService {
  constructor(
    protected readonly prisma: PrismaService,
    private dataAnalyticsRepository: DataAnalyticsRepository,
  ) {}
}
