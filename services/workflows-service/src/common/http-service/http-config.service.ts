import { HttpModule, HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerService } from '../app-logger/app-logger.service';

export const RETRY_DELAY_IN_MS = 1500; // extract to config, delay retry

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
    // useClass: HttpConfigService,
    useFactory: (configService: ConfigService) => {
      const newAbortSignal = (timeoutMs: number) => {
        const abortController = new AbortController();
        setTimeout(() => abortController.abort(), timeoutMs || 0);

        return abortController.signal;
      };

      const timeout = configService.get('HTTP_TIMEOUT_IN_MS', 10_000);

      return {
        timeout,
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 10),
        retryAttempts: configService.get('HTTP_RETRY_ATTEMPTS', 0),
        // 👇️ aborts request after 3 seconds (connectivity issues)
        signal: newAbortSignal(timeout),
        validateStatus: (status: number) => {
          return status < 500; // Resolve only if the status code is less than 500
        },
      };
    },
    inject: [ConfigService],
  });
