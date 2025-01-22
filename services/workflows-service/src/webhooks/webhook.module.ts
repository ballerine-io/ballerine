import { BullBoardModule } from '@bull-board/nestjs';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConnectionOptions } from 'bullmq';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { env } from '@/env';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WebhookService } from './webhook.service';

const REDIS_CONFIG: ConnectionOptions = {
  host: env.REDIS_HOST || 'localhost',
  port: env.REDIS_PORT || 7381,
  ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  ...(env.REDIS_DB ? { db: env.REDIS_DB } : {}),
};

@Global()
@Module({
  imports: [
    AppLoggerModule,
    HttpModule,
    BullModule.forRoot({
      connection: REDIS_CONFIG,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter as any,
    }),
  ],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
