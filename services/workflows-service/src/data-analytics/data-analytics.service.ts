import { Injectable } from '@nestjs/common';
import { DataAnalyticsRepository } from './data-analytics.repository';

@Injectable()
export class DataAnalyticsService {
  constructor(private dataAnalyticsRepository: DataAnalyticsRepository) {}
}
