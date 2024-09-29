import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { env } from '@/env';
import { WebhookService } from '@/bull-mq/webhook/webhook.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WebhookProcessor } from '@/bull-mq/webhook/webhook.processor';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';

const QUEUE_NAMES = [
  {
    name: 'webhook-queue',
    config: {},
  },
];

@Module({
  imports: [
    AppLoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          password: env.REDIS_PASSWORD,
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      }),
    }),
    BullModule.registerQueue(...QUEUE_NAMES.map(({ name }) => ({ name }))),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    ...QUEUE_NAMES.map(({ name }) =>
      BullBoardModule.forFeature({
        name,
        adapter: BullAdapter,
      }),
    ),
  ],
  providers: [WebhookProcessor, WebhookService, AppLoggerService],
  exports: [BullModule, WebhookService],
})
export class BullMqModule {}
