import { Module } from '@nestjs/common';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { OutgoingWebhooksService } from '@/webhooks/outgoing-webhooks/outgoing-webhooks.service';

@Module({
  imports: [AppLoggerModule],
  providers: [OutgoingWebhooksService],
  exports: [OutgoingWebhooksService],
})
export class OutgoingWebhooksModule {}
