import * as swagger from '@nestjs/swagger';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Controller } from '@nestjs/common';

@swagger.ApiTags('Data Analytics')
@Controller('external/data-analytics')
export class DataAnalyticsControllerExternal {
  constructor(
    protected readonly service: DataAnalyticsService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}
}
