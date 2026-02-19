export const DOWNLOAD_ONLY_MIME_TYPES = [
  // xls
  'application/vnd.ms-excel',
  // xlsx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const MIKASHBOKS_CALENDLY_LINK = 'https://calendly.com/mikashboks';

// Taken from https://gist.github.com/dperini/729294, changed a bit to allow only http/https and make protocol optional
export const URL_REGEX =
  /((https?):\/\/)?([a-zA-Z0-9-_]+\.)+[a-zA-Z0-9]+(\.[a-z]{2})?(\/[a-zA-Z0-9_#-]+)*(\/)?(\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?/;

export const NO_VIOLATION_DETECTED_RISK_INDICATOR_ID = 'no-violation-detected';
export const POSITIVE_RISK_LEVEL_ID = 'positive';
