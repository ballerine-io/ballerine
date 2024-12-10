export const BUILT_IN_ACTION = {
  NO_OP: 'NO_OP',
} as const;

export type BuiltInAction = (typeof BUILT_IN_ACTION)[keyof typeof BUILT_IN_ACTION];
