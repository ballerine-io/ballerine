import { IAppLogger, LogPayload } from '@/common/abstract-logger/abstract-logger';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Inject('LOGGER') private readonly logger: IAppLogger,
    private readonly cls: ClsService,
  ) {}

  log(message: string, logData: LogPayload = {}) {
    this.logger.info(message, { ...this.getLogMetadata(), logData });
  }

  error(message: string, logData: LogPayload = {}) {
    this.logger.error(message, { ...this.getLogMetadata(), logData });
  }

  warn(message: string, logData: LogPayload = {}) {
    this.logger.warn(message, { ...this.getLogMetadata(), logData });
  }

  debug(message: string, logData: LogPayload = {}) {
    this.logger.debug(message, { ...this.getLogMetadata(), logData });
  }

  private getLogMetadata() {
    return {
      requestId: this.cls.get('requestId'),
    };
  }
}
