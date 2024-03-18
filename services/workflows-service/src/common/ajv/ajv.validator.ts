import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';

export const ajv = new Ajv({
  strict: false,
  coerceTypes: true,
});

addFormats(ajv, {
  formats: ['email', 'uri', 'date', 'date-time'],
  keywords: true,
});
addKeywords(ajv);
