import { Module } from '@nestjs/common';
import { StatisticsControllerInternal } from '@/statistics/statistics.controller.internal';
import { StatisticsService } from '@/statistics/statistics.service';

@Module({
  controllers: [StatisticsControllerInternal],
  providers: [StatisticsService],
})
export class StatisticsModule {}
