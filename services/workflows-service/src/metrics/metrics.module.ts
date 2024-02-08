import { MetricsRepository } from '@/metrics/repository/metrics.repository';
import { MetricsService } from '@/metrics/service/metrics.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { MetricsController } from './metrics.controller';

@Module({
  controllers: [MetricsController],
  imports: [PrismaModule],
  providers: [MetricsRepository, MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
