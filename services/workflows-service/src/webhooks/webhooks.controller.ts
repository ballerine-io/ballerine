import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as nestAccessControl from 'nest-access-control';
import * as errors from '../errors';
import { Public } from '@/common/decorators/public.decorator';
import { AmlWebhookInput } from './dtos/aml-webhook-input';
import { IndividualAmlWebhookInput } from '@/webhooks/dtos/individual-aml-webhook-input';
import { WebhooksService } from '@/webhooks/webhooks.service';

const WEBHOOKS = {
  AML_INDIVIDUAL_MONITORING_UPDATE: 'aml.individuals.monitoring.update',
} as const;

const ENTITY_TYPES = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const;

@swagger.ApiBearerAuth()
@swagger.ApiTags('Webhooks')
@common.Controller('webhooks')
export class WebhooksController {
  constructor(
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    private readonly webhooksService: WebhooksService,
  ) {}

  @common.Post('/:entityType/aml')
  @swagger.ApiOkResponse()
  @common.HttpCode(200)
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  // @VerifyUnifiedApiSignatureDecorator()
  async amlHook(
    @common.Param() { entityType }: AmlWebhookInput,
    @common.Body() data: IndividualAmlWebhookInput,
  ) {
    try {
      if (entityType === ENTITY_TYPES.INDIVIDUAL) {
        const { eventName } = data;

        if (eventName === WEBHOOKS.AML_INDIVIDUAL_MONITORING_UPDATE) {
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
