import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookService } from './webhook.service';

@Module({
  imports: [AppLoggerModule, HttpModule, ConfigModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
