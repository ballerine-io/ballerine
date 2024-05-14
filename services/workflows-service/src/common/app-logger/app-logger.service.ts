import { IAppLogger, LogPayload } from '@/common/abstract-logger/abstract-logger';
import { Inject, Injectable, LoggerService, OnModuleDestroy } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { setLogger } from '@ballerine/workflow-core';

@Injectable()
export class AppLoggerService implements LoggerService, OnModuleDestroy {
  constructor(
    @Inject('LOGGER') private readonly logger: IAppLogger,
    private readonly cls: ClsService,
  ) {
    setLogger({
      log: this.log.bind(this),
      error: this.error.bind(this),
      warn: this.warn.bind(this),
      debug: this.debug.bind(this),
    });
  }

  async onModuleDestroy() {
    await this.logger.close();
  }

  log(message: string, logData: LogPayload = {}) {
    this.logger.info(message, { ...this.getLogMetadata(), logData });
  }

  error(error: Error | string | unknown, logData: LogPayload = {}) {
    const payload: any = { ...this.getLogMetadata(), logData };

    if (typeof error === 'string') {
      payload.stack = new Error().stack;
    }

    this.logger.error(error, payload);
  }

  warn(message: string, logData: LogPayload = {}) {
    this.logger.warn(message, { ...this.getLogMetadata(), logData });
  }

  debug(message: string, logData: LogPayload = {}) {
    this.logger.debug(message, { ...this.getLogMetadata(), logData });
  }

  private getLogMetadata() {
    const metadata = {
      reqId: undefined,
    };

    const reqId = this.cls.get('requestId');

    if (reqId) {
      metadata.reqId = reqId;
    }

    const entity = this.cls.get('entity');

    if (entity && entity.type !== 'admin') {
      if (entity.type === 'customer') {
        // @ts-ignore
        metadata.entity = entity.customer;
      } else if (entity.type === 'endUser') {
        // @ts-ignore
        metadata.entity = entity.endUser;
      }
    }

    return metadata;
  }
}
