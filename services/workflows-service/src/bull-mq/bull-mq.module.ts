import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { env } from '@/env';
import { WebhookService } from '@/bull-mq/webhook/webhook.service';
import { WebhookProcessor } from '@/bull-mq/webhook/webhook.processor';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { QUEUES } from '@/bull-mq/consts';

@Module({
  imports: [
    AppLoggerModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          password: env.REDIS_PASSWORD,
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      }),
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUES).map(queue => ({
        name: queue.name,
        ...queue.config,
      })),
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ...Object.values(QUEUES).map(queue =>
      BullBoardModule.forFeature({
        name: queue.name,
        adapter: BullAdapter,
      }),
    ),
  ],
  providers: [WebhookProcessor, WebhookService],
  exports: [BullModule, WebhookService],
})
export class BullMqModule {}
