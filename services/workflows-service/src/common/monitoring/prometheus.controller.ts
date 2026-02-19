import { Controller, Get, Header } from '@nestjs/common';
import { BullMQPrometheusService } from './bullmq-prometheus.service';

@Controller('metrics')
export class PrometheusController {
  constructor(private readonly bullMQPrometheusService: BullMQPrometheusService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.bullMQPrometheusService.getMetrics();
  }
}
