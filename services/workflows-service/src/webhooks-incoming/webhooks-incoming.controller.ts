import * as common from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import * as errors from '../errors';
import { AmlWebhookInput } from './types/aml-webhook-input.dto';
import { IndividualAmlWebhookInput } from './types/individual-aml-webhook-input.dto';
import { IncomingWebhooksService } from './webhooks-incoming.service';

const EntityType = {
  BUSINESS: 'business',
  INDIVIDUAL: 'individual',
} as const;

@swagger.ApiBearerAuth()
@swagger.ApiTags('Internal Webhooks')
@swagger.ApiExcludeController()
@common.Controller('webhooks')
export class IncomingWebhooksController {
  constructor(
    private readonly incomingWebhooksService: IncomingWebhooksService,
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
    if (!data?.endUserId) {
      throw new BadRequestException('Missing endUserId');
    }

    try {
      if (entityType === EntityType.INDIVIDUAL) {
        return await this.incomingWebhooksService.handleIndividualAmlHit({
          endUserId: data.endUserId,
          data,
        });
      }

      this.logger.error(`Unknown entity type: ${entityType}`);
      throw new BadRequestException('Unknown entity type');
    } catch (error) {
      this.logger.error('amlHook::', { entityType, data, error });
      throw error;
    }
  }
}
