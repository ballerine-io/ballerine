import { HttpModule, HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerService } from '../app-logger/app-logger.service';

export const RETRY_DELAY_IN_MS = 1500; // extract to config, delay retry

const _httpStatusFromAxiosMap = {
  ENOTFOUND: HttpStatus.NOT_FOUND,
  ECONNABORTED: HttpStatus.INTERNAL_SERVER_ERROR,
};

export const getHttpStatusFromAxiosError = (
  code?: keyof typeof _httpStatusFromAxiosMap | string,
) => {
  if (!code || !(code in _httpStatusFromAxiosMap)) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // @ts-ignore
  return _httpStatusFromAxiosMap[code];
};

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: this.configService.get('HTTP_TIMEOUT_IN_MS', 5000),
      maxRedirects: this.configService.get('HTTP_MAX_REDIRECTS', 10),
      validateStatus: (status: number) => {
        return status < 500; // Resolve only if the status code is less than 500
      },
    };
  }
}

export const initHttpMoudle = () =>
  HttpModule.registerAsync({
    imports: [ConfigModule],
    useClass: HttpConfigService,
    useFactory: (configService: ConfigService) => ({
      timeout: configService.get('HTTP_TIMEOUT_IN_MS', 5000),
      maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 10),
      validateStatus: (status: number) => {
        return status < 500; // Resolve only if the status code is less than 500
      },
    }),
    inject: [ConfigService],
  });
