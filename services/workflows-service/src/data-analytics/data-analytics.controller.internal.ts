import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';

@swagger.ApiExcludeController()
@common.Controller('internal/data-analyticss')
export class DataAnalyticsControllerInternal {
  constructor(protected readonly service: DataAnalyticsService) {}
}
