export interface ITransitionSchema {
  state: string;
  schema: Record<PropertyKey, unknown>;
  additionalParameters?: Record<PropertyKey, unknown>;
}
