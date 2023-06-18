import { IAppLogger, LogPayload } from '@/common/abstract-logger/abstract-logger';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Inject('LOGGER') private readonly logger: IAppLogger,
    private readonly cls: ClsService,
  ) {}

  log(message: string, payload: LogPayload = {}) {
    this.logger.info(message, { ...this.getLogMetadata(), logData: payload });
  }

  error(message: string, payload: LogPayload = {}) {
    this.logger.error(message, { ...this.getLogMetadata(), logData: payload });
  }

  warn(message: string, payload: LogPayload = {}) {
    this.logger.warn(message, { ...this.getLogMetadata(), logData: payload });
  }

  debug(message: string, payload: LogPayload = {}) {
    this.logger.debug(message, { ...this.getLogMetadata(), logData: payload });
  }

  private getLogMetadata() {
    return {
      'request-id': this.cls.get('requestId'),
    };
  }
}
