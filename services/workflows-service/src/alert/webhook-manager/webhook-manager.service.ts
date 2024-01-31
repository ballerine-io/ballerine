import { lastValueFrom, tap } from 'rxjs';
import { sign } from '@/common/utils/sign/sign';
import { alertWebhookFailure } from '@/events/alert-webhook-failure';
import { Webhook } from '@/events/get-webhooks';
import { DefaultContextSchema } from '@ballerine/common';
import { HttpService } from '@nestjs/axios';
import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { SentryInterceptor } from '@/sentry/sentry.interceptor';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ExtractWorkflowEventData } from '@/workflow/types';
import { WebhookApiHttpService } from './webhook-api-http.service';

@common.Injectable()
@common.UseInterceptors(SentryInterceptor)
export class WebhookManagerService {
  constructor(
    private readonly cls: ClsService,
    protected readonly logger: AppLoggerService,
    protected readonly configService: ConfigService,
    protected readonly httpService: WebhookApiHttpService,
  ) {}

  public async testApiCall() {
    const res = await lastValueFrom(this.httpService.get('https://javascript.call.io'));
  }
  catch(error: Error | any) {
    this.logger.error('Failed to send webhook', {
      error,
    });

    throw error;
  }
}
