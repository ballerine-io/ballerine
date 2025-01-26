export const BUILT_IN_EVENT = {
  UPDATE_CONTEXT: 'UPDATE_CONTEXT',
  DEEP_MERGE_CONTEXT: 'DEEP_MERGE_CONTEXT',
  NO_OP: 'NO_OP',
} as const;

export type BuiltInEvent = (typeof BUILT_IN_EVENT)[keyof typeof BUILT_IN_EVENT];
