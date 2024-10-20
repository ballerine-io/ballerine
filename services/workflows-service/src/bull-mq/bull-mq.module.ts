import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { QUEUES } from '@/bull-mq/consts';
import { OutgoingWebhookQueueService } from '@/bull-mq/outgoing-webhook/outgoing-webhook-queue.service';
import { REDIS_CONFIG } from '@/redis/const/redis-config';
import { OutgoingWebhooksModule } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.module';

@Module({
  imports: [
    AppLoggerModule,
    OutgoingWebhooksModule,
    BullModule.forRootAsync({
      useFactory: () => {
        return {
          connection: {
            ...REDIS_CONFIG,
          },
        };
      },
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
  providers: [OutgoingWebhookQueueService],
  exports: [BullModule, OutgoingWebhookQueueService],
})
export class BullMqModule {}
