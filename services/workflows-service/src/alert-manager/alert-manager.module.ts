import { HttpStatus, Module } from '@nestjs/common';
import { AlertManagerService } from './AlertManagerService';
import { HttpModule, HttpService } from '@nestjs/axios';
import axiosRetry from 'axios-retry';
import { isAxiosError } from 'axios';
import { getHttpStatusFromAxiosError, interceptAxiosRequests } from '@/common/http-service/utils';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ClsService } from 'nestjs-cls';
import { AlertManagerController } from './alert-manager.controller';

@Module({
  providers: [AlertManagerService],
  imports: [
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
  ],
  controllers: [AlertManagerController],
})
export class AlertManagerModule {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLoggerService,
    private readonly clsService: ClsService,
  ) {}

  // Defining others configuration for our Axios instance
  onModuleInit() {
    const _axios = this.httpService.axiosRef;

    interceptAxiosRequests(this.logger, _axios, AlertManagerModule.name);

    axiosRetry(_axios, {
      retries: 3,
      retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1500),
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
