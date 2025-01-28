import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';

import { QUEUES } from '@/bull-mq/consts';
import { IncomingWebhookQueueService } from '@/bull-mq/queues/incoming-webhook-queue.service';
import { OutgoingWebhookQueueService } from '@/bull-mq/queues/outgoing-webhook-queue.service';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { OutgoingWebhooksModule } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.module';

@Module({
  imports: [
    AppLoggerModule,
    ConfigModule,
    OutgoingWebhooksModule,
    // Register bull & init redis connection
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    // Register bull board module at /api/queues
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    // Register queues and pass config to bull board forFeature
    ...Object.values(QUEUES).flatMap(queue => {
      const queues: Array<Omit<RegisterQueueOptions, 'name'> & { name: string }> = [
        { name: queue.name, ...queue.config },
      ];

      if ('dlq' in queue) {
        queues.push({ name: queue.dlq });
      }

      return queues.flatMap(queue => [
        BullModule.registerQueue(queue),
        BullBoardModule.forFeature({ name: queue.name, adapter: BullMQAdapter }),
      ]);
    }),
  ],
  providers: [OutgoingWebhookQueueService, IncomingWebhookQueueService],
  exports: [OutgoingWebhookQueueService, IncomingWebhookQueueService],
})
export class BullMqModule {}
