import { AnyRecord } from '@ballerine/common';

export type LoggerInterface = {
  log(message: string, logData?: AnyRecord): void;
  error(message: string, logData?: AnyRecord): void;
  warn(message: string, logData?: AnyRecord): void;
  debug(message: string, logData?: AnyRecord): void;
};

/* eslint-disable no-console */
export let logger: LoggerInterface = {
  log: (message: string, logData: AnyRecord = {}) => console.log(message, logData),
  error: (message: string, logData: AnyRecord = {}) => console.error(message, logData),
  warn: (message: string, logData: AnyRecord = {}) => console.warn(message, logData),
  debug: (message: string, logData: AnyRecord = {}) => console.debug(message, logData),
};
/* eslint-enable no-console */

export const setLogger = (newLogger: LoggerInterface) => {
  logger = newLogger;
};
