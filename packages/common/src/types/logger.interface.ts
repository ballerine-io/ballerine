import { AnyRecord } from '@/types/index';

export type LoggerInterface = {
  log: (message: string, logData?: AnyRecord) => void;
  error: (message: string, logData?: AnyRecord) => void;
  warn: (message: string, logData?: AnyRecord) => void;
  debug: (message: string, logData?: AnyRecord) => void;
};
