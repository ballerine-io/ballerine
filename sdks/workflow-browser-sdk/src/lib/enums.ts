export const Event = {
  WILD_CARD: '*',
  USER_NEXT_STEP: 'USER_NEXT_STEP',
  USER_PREV_STEP: 'USER_PREV_STEP',
  ERROR: 'ERROR',
  STATE_ACTION_STATUS: 'STATE_ACTION_STATUS',
} as const;

export const Action = {
  USER_NEXT_STEP: 'USER_NEXT_STEP',
  USER_PREV_STEP: 'USER_PREV_STEP',
  ERROR: 'ERROR',
} as const;

export const Persistence = {
  LOCAL_STORAGE: 'LOCAL_STORAGE',
  BACKEND: 'BACKEND',
} as const;
