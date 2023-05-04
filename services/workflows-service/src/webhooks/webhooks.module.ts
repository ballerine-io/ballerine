import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [WebhooksService],
})
export class WebhooksModule {}
