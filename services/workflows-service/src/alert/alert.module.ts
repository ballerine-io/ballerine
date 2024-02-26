import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { DataAnalyticsModule } from '@/data-analytics/data-analytics.module';
import { PasswordService } from '@/auth/password/password.service';
import { UserService } from '@/user/user.service';
import { HttpStatus, Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { AlertControllerInternal } from '@/alert/alert.controller.internal';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertService } from '@/alert/alert.service';
import { AlertControllerExternal } from '@/alert/alert.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import {
  WebhookHttpService,
  WebhookManagerService,
} from '@/alert/webhook-manager/webhook-manager.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import axiosRetry from 'axios-retry';
import { isAxiosError } from 'axios';
import { getHttpStatusFromAxiosError, interceptAxiosRequests } from '@/common/http-service/utils';
import { WebhookEventEmitterService } from './webhook-manager/webhook-event-emitter.service';
import { ProjectModule } from '@/project/project.module';
import { UserRepository } from '@/user/user.repository';
import { AlertDefinitionModule } from '@/alert-definition/alert-definition.module';

@Module({
  imports: [
    DataAnalyticsModule,
    ACLModule,
    PrismaModule,
    ProjectModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 10,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      validateStatus: (status: number) => {
        return status < 400; // Resolve only if the status code is less than 500
      },
    }),
    AlertDefinitionModule,
  ],
  controllers: [AlertControllerInternal, AlertControllerExternal],
  providers: [
    {
      provide: WebhookHttpService,
      useExisting: HttpService,
    },
    AlertService,
    AlertRepository,
    AlertDefinitionRepository,
    WebhookManagerService,
    WebhookEventEmitterService,
    // TODO: Export to user module
    UserService,
    UserRepository,
    PasswordService,
  ],
  exports: [ACLModule, AlertService, WebhookEventEmitterService],
})
export class AlertModule {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLoggerService,
  ) {}

  // Defining others configuration for our Axios instance
  onModuleInit() {
    const _axios = this.httpService.axiosRef;

    interceptAxiosRequests(this.logger, _axios, AlertModule.name);

    axiosRetry(_axios, {
      retries: 3,
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1500),
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      retryCondition(error: unknown) {
        if (error && isAxiosError(error)) {
          if (error.response) {
            switch (error.response.status) {
              //retry only if status: 429, 500, 501
              case 429:
              case 500:
              case 501:
                return true;
              default:
                return false;
            }
          } else if (getHttpStatusFromAxiosError(error.code) === HttpStatus.INTERNAL_SERVER_ERROR) {
            return false;
          }
        }

        return true;
      },
      onRetry: (retryCount, error, requestConfig) => {
        this.logger.warn(`Retrying request attempt ${retryCount}`, {
          error: error.cause,
          requestConfig: {
            url: requestConfig.url,
            method: requestConfig.method?.toUpperCase(),
            headers: requestConfig.headers,
          },
        });
      },
    });
  }
}
