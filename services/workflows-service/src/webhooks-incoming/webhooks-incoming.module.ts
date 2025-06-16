import { Module } from '@nestjs/common';

import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { CustomerModule } from '@/customer/customer.module';
import { EndUserModule } from '@/end-user/end-user.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { WorkflowModule } from '@/workflow/workflow.module';
import { IncomingWebhooksController } from './webhooks-incoming.controller';
import { IncomingWebhooksService } from './webhooks-incoming.service';

@Module({
  imports: [
    AppLoggerModule,
    CustomerModule,
    EndUserModule,
    WorkflowModule,
    WorkflowDefinitionModule,
    WebhooksModule,
  ],
  providers: [IncomingWebhooksService],
  controllers: [IncomingWebhooksController],
})
export class IncomingWebhooksModule {}
