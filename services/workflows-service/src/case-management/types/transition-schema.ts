export interface TransitionSchema {
  state: string;
  schema: Record<PropertyKey, unknown>;
  additionalParameters?: Record<PropertyKey, unknown>;
}
