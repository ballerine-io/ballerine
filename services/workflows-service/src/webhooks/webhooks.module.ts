import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [AppLoggerModule, HttpModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
