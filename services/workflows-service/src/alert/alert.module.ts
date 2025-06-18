// eslint-disable-next-line import/no-cycle
import { DataAnalyticsModule } from '@/data-analytics/data-analytics.module';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { PasswordService } from '@/auth/password/password.service';
import { UserService } from '@/user/user.service';
import { forwardRef, HttpStatus, Module, OnModuleInit } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { AlertControllerInternal } from '@/alert/alert.controller.internal';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertService } from '@/alert/alert.service';
import { AlertControllerExternal } from '@/alert/alert.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import axiosRetry from 'axios-retry';
import { isAxiosError } from 'axios';
import { getHttpStatusFromAxiosError, interceptAxiosRequests } from '@/common/http-service/utils';
import { ProjectModule } from '@/project/project.module';
import { UserRepository } from '@/user/user.repository';
import { AlertDefinitionModule } from '@/alert-definition/alert-definition.module';
import { SentryModule } from '@/sentry/sentry.module';
import { WebhooksModule } from '@/webhooks/webhooks.module';
import { AlertQueueService } from './alert-queue.service';
import { QueueModule } from '@/common/queue/queue.module';
import { MonitoringModule } from '@/common/monitoring/monitoring.module';

@Module({
  imports: [
    forwardRef(() => DataAnalyticsModule),
    ACLModule,
    PrismaModule,
    SentryModule,
    ProjectModule,
    WebhooksModule,
    QueueModule,
    MonitoringModule,
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
    AlertService,
    AlertRepository,
    AlertDefinitionRepository,
    AlertQueueService,
    // TODO: Export to user modue
    UserService,
    UserRepository,
    PasswordService,
  ],
  exports: [ACLModule, AlertRepository, AlertService],
})
export class AlertModule implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
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
