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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function composeQueueAndDlqBoard(queue: (typeof QUEUES)[keyof typeof QUEUES]) {
  const baseFeature = BullBoardModule.forFeature({
    name: queue.name,
    adapter: BullAdapter,
  });

  const dlqFeature =
    'dlq' in queue
      ? BullBoardModule.forFeature({
          name: `${queue.name}-dlq`,
          adapter: BullAdapter,
        })
      : null;

  return dlqFeature ? [baseFeature, dlqFeature] : [baseFeature];
}

const composeInitiateQueueWithDlq = (queue: (typeof QUEUES)[keyof typeof QUEUES]) =>
  [
    {
      name: queue.name,
      ...queue.config,
    },
    'dlq' in queue && {
      name: queue.dlq,
    },
  ].filter(Boolean);

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
      ...Object.values(QUEUES).flatMap(queue => {
        return composeInitiateQueueWithDlq(queue);
      }),
    ),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ...Object.values(QUEUES)
      .map(queue => composeQueueAndDlqBoard(queue))
      .flat(),
  ],
  providers: [OutgoingWebhookQueueService],
  exports: [BullModule, OutgoingWebhookQueueService],
})
export class BullMqModule {}
