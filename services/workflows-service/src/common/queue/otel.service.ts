import { Injectable, OnModuleInit } from '@nestjs/common';
import { BullMQOtel } from 'bullmq-otel';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { env } from '@/env';

@Injectable()
export class QueueOtelService implements OnModuleInit {
  private bullMQOtel: BullMQOtel | null = null;

  constructor(private readonly logger: AppLoggerService) {}

  onModuleInit() {
    this.setupOpenTelemetry();
  }

  private setupOpenTelemetry() {
    try {
      if (!env.OTEL_ENABLED) {
        this.logger.log('OpenTelemetry for BullMQ is disabled');

        return;
      }

      this.bullMQOtel = new BullMQOtel('ballerine-workflows-service');

      this.logger.log('BullMQ OpenTelemetry metrics instrumentation initialized');
    } catch (error) {
      this.logger.error('Failed to initialize BullMQ OpenTelemetry', { error });
    }
  }

  getBullMQOtel(): BullMQOtel | null {
    return this.bullMQOtel;
  }
}
