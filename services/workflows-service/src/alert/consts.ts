export const THREE_DAYS = 3;
export const SEVEN_DAYS = 7;
export const TWENTY_ONE_DAYS = 21;

export const daysToMinutesConverter = (days: number) => days * 24 * 60;

export const ALERT_DEDUPE_STRATEGY_DEFAULT = {
  mute: false,
  cooldownTimeframeInMinutes: daysToMinutesConverter(SEVEN_DAYS),
};

export const AlertExecutionStatus = {
  SUCCEEDED: 'SUCCEEDED',
  SKIPPED: 'SKIPPED',
  FAILED: 'FAILED',
} as const;
