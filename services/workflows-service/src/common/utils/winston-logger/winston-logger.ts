import { IAppLogger, LogPayload } from '@/common/abstract-logger/abstract-logger';
import { env } from '@/env';
import { createLogger, format, transports, Logger as TWinstonLogger } from 'winston';

export class WinstonLogger implements IAppLogger {
  private logger: TWinstonLogger;

  constructor() {
    const isLocal = process.env.ENVIRONMENT_NAME === 'local';

    const jsonFormat = format.combine(format.timestamp(), format.json(), format.uncolorize());

    const prettyFormat = format.combine(
      format.colorize({ all: true }),
      format.timestamp(),
      format.splat(),
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
      format: isLocal ? prettyFormat : jsonFormat,
      transports: [new transports.Console()],
      level: env.LOG_LEVEL,
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.logger.end(() => {
          this.logger.transports.forEach(transport => {
            if (transport instanceof transports.File) {
              transport.close?.(); // Optional chaining to invoke 'close' method
            }
          });

          resolve();
        });
      } catch (err) {
        reject(err);
      }
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
