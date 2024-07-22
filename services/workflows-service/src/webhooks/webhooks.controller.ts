import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { Public } from '@/common/decorators/public.decorator';
import { AmlWebhookInput } from './dtos/aml-webhook-input';
import { IndividualAmlWebhookInput } from '@/webhooks/dtos/individual-aml-webhook-input';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { BadRequestException } from '@nestjs/common';
import { isObject } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

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

  @common.Post('/:entityType/aml')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async amlHook(
    @common.Param() { entityType }: AmlWebhookInput,
    @common.Body() { data }: IndividualAmlWebhookInput,
  ) {
    if (!(isObject(data) && 'endUserId' in data && data.endUserId)) {
      throw new BadRequestException('Missing endUserId');
    }

    try {
      if (entityType === EntityType.INDIVIDUAL) {
        await this.webhooksService.handleIndividualAmlHit({ endUserId: data.endUserId, data });
      } else {
        this.logger.error(`Unknown entity type: ${entityType}`);

        throw new BadRequestException('Unknown entity type');
      }
    } catch (error) {
      this.logger.error('amlHook::', { entityType, data, error });

      throw error;
    }

    return;
  }
}
