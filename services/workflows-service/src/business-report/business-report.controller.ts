import { fetchBusinessInformation } from './../../../../apps/kyb-app/src/domains/business/business.api';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as swagger from '@nestjs/swagger';

import * as types from '@/types';

import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { Controller, Get, Query } from '@nestjs/common';

import { TIME_UNITS } from '@/data-analytics/consts';
import { GetBusinessReportDto } from './dto/get-business-report.dto';
import { BusinessReportService } from './business-report.service';

@Controller('business-report')
export class BusinessReportController {
  constructor(
    protected readonly service: BusinessReportService,
    protected readonly logger: AppLoggerService,
  ) {}

  @Get()
  @swagger.ApiOkResponse({ description: 'Returns an array of reports.' })
  @swagger.ApiQuery({ name: 'businessId', description: 'Filter by business ID.', required: true })
  @swagger.ApiQuery({
    name: 'startDate',
    type: Date,
    description: 'Filter by transactions after or on this date.',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'endDate',
    type: Date,
    description: 'Filter by transactions before or on this date.',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'timeValue',
    type: 'number',
    description: 'Number of time units to filter on',
    required: false,
  })
  @swagger.ApiQuery({
    name: 'timeUnit',
    type: 'enum',
    enum: Object.values(TIME_UNITS),
    description: 'The time unit used in conjunction with timeValue',
    required: false,
  })
  async getBusinessReport(
    @Query() queryParameters: GetBusinessReportDto,
    @CurrentProject() projectId: types.TProjectId,
  ) {
    return this.service.findManyWithFilters(queryParameters, projectId);
  }
}
