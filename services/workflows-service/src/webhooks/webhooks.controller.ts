import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Public } from '@/common/decorators/public.decorator';
import { WebhooksService } from '@/webhooks/webhooks.service';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Internal Webhooks')
@swagger.ApiExcludeController()
@common.Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly logger: AppLoggerService,
  ) {}

  @common.Get('/outgoing')
  @common.HttpCode(200)
  @Public()
  async testOutgoing() {
    // Something happens and we decide to send outgoing webhook call
    const secret = 'abcd';
    await this.webhooksService.invokeWebhook('workflow.context.document.changed', {
      url: 'https://example.com',
      method: 'POST',
      data: {} as any,
      secret,
    });
  }
}
