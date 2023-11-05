export interface LogPayload {
  [k: string]: any;
}

export abstract class IAppLogger {
  abstract log(message: string, payload: LogPayload): void;
  abstract info(message: string, payload: LogPayload): void;
  abstract warn(message: string, payload: LogPayload): void;
  abstract debug(message: string, payload: LogPayload): void;
  abstract error(message: string, payload: LogPayload): void;
  abstract close(): Promise<void>;
}
