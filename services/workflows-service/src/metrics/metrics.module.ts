import { MetricsRepository } from '@/metrics/repository/metrics.repository';
import { MetricsService } from '@/metrics/service/metrics.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  providers: [MetricsRepository, MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
