import { Controller, Get, Header } from '@nestjs/common';
import { BullMQPrometheusService } from './bullmq-prometheus.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller('metrics')
export class PrometheusController {
  constructor(private readonly bullMQPrometheusService: BullMQPrometheusService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.bullMQPrometheusService.getMetrics();
  }
}
