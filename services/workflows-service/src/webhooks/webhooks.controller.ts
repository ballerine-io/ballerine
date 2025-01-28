import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';

import { WebhooksService } from './webhooks.service';
import { Public } from '@/common/decorators/public.decorator';

const EntityType = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const;

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
    await this.webhooksService.invokeWebhook('user-created-outgoing', {
      data: { userId: 'random-id' },
      secret,
    });
  }

  // @common.Post('/:entityType/aml')
  // @swagger.ApiOkResponse()
  // @common.HttpCode(200)
  // @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  // @Public()
  // @VerifyUnifiedApiSignatureDecorator()
  // async amlHook(
  //   @common.Param() { entityType }: AmlWebhookInput,
  //   @common.Body() { data }: IndividualAmlWebhookInput,
  // ) {
  //   if (!(isObject(data) && 'endUserId' in data && data.endUserId)) {
  //     throw new BadRequestException('Missing endUserId');
  //   }

  //   try {
  //     if (entityType === EntityType.INDIVIDUAL) {
  //       await this.webhooksService.handleIncoming();
  //     } else {
  //       this.logger.error(`Unknown entity type: ${entityType}`);

  //       throw new BadRequestException('Unknown entity type');
  //     }
  //   } catch (error) {
  //     this.logger.error('amlHook::', { entityType, data, error });

  //     throw error;
  //   }

  //   return;
  // }
}
