import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';

@Injectable()
export class BullMQPrometheusService implements OnModuleInit {
  private queues: Queue[] = [];

  constructor(private readonly logger: AppLoggerService) {}

  onModuleInit() {
    this.logger.log('BullMQ Prometheus service initialized');
  }

  registerQueue(queue: Queue): void {
    if (!queue) {
      return;
    }

    this.queues.push(queue);
    this.logger.log(`Queue ${queue.name} registered for Prometheus metrics`);
  }

  getQueues(): Queue[] {
    return this.queues;
  }

  async getMetrics(): Promise<string> {
    try {
      if (this.queues.length === 0) {
        return '# No BullMQ queues registered for metrics';
      }

      const globalVariables = {
        environment: env.ENVIRONMENT_NAME || 'local',
        service: 'ballerine-workflows-service',
      };

      const metrics = await this.queues[0].exportPrometheusMetrics(globalVariables);
      return metrics;
    } catch (error) {
      this.logger.error('Failed to export BullMQ Prometheus metrics', { error });
      return '# Error exporting BullMQ metrics';
    }
  }
}
