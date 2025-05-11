import { Module } from '@nestjs/common';
import { BullMQPrometheusService } from './bullmq-prometheus.service';
import { PrometheusController } from './prometheus.controller';

@Module({
  controllers: [PrometheusController],
  providers: [BullMQPrometheusService],
  exports: [BullMQPrometheusService],
})
export class MonitoringModule {}
