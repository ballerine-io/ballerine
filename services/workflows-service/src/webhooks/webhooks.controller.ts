import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { Public } from '@/common/decorators/public.decorator';
import { AmlWebhookInput } from './dtos/aml-webhook-input';
import { IndividualAmlWebhookInput } from '@/webhooks/dtos/individual-aml-webhook-input';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';

const Webhook = {
  AML_INDIVIDUAL_MONITORING_UPDATE: 'aml.individuals.monitoring.update',
} as const;

const EntityType = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const;

@swagger.ApiBearerAuth()
@swagger.ApiTags('Webhooks')
@common.Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @common.Post('/:entityType/aml')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async amlHook(
    @common.Param() { entityType }: AmlWebhookInput,
    @common.Body() data: IndividualAmlWebhookInput,
  ) {
    try {
      if (entityType === EntityType.INDIVIDUAL) {
        const { eventName } = data;

        if (eventName === Webhook.AML_INDIVIDUAL_MONITORING_UPDATE) {
          await this.webhooksService.handleIndividualAmlHit(data as IndividualAmlWebhookInput);
        }
      }
    } catch (error) {
      console.error(error);

      throw error;
    }

    return;
  }
}
