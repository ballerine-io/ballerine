import type { JsonValue } from 'type-fest';

export type InputJsonValue = Omit<JsonValue, 'null'>;

export interface IObjectWithId {
  id: string;
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;
