import { IAppLogger, LogPayload } from '@/common/abstract-logger/abstract-logger';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as TWinstonLogger } from 'winston';

export type LoggerSettings = {
  envName: string;
  logLevel: string;
};

export class WinstonLogger implements IAppLogger {
  private logger: TWinstonLogger;

  constructor(@Inject('LOGGER_SETTINGS') private readonly loggerSettings: LoggerSettings) {
    const isProduction = loggerSettings.envName === 'production';

    const productionFormat = format.combine(format.timestamp(), format.json());

    const developmentFormat = format.combine(
      format.colorize({ all: true }),
      format.timestamp(),
      format.printf(({ timestamp, level, message, ...metadata }) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        let msg = `${timestamp} [${level}] : ${message} `;
        if (Object.keys(metadata).length > 0) {
          msg += JSON.stringify(metadata, null, 2);
        }
        return msg;
      }),
    );

    this.logger = createLogger({
      level: loggerSettings.logLevel || 'info',
      format: isProduction ? productionFormat : developmentFormat,
      transports: [new transports.Console()],
    });
  }

  log(message: string, payload: LogPayload = {}) {
    this.logger.info(message, payload);
  }

  info(message: string, payload: LogPayload = {}) {
    this.logger.info(message, payload);
  }

  error(message: string, payload: LogPayload = {}) {
    this.logger.error(message, payload);
  }

  warn(message: string, payload: LogPayload = {}) {
    this.logger.warn(message, payload);
  }

  debug(message: string, payload: LogPayload = {}) {
    this.logger.debug(message, payload);
  }
}
