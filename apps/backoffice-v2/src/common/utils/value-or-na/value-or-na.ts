import { valueOrFallback } from '../value-or-fallback/value-or-fallback';

/**
 * @description Returns 'N/A' if value is falsy.
 */
export const valueOrNA = valueOrFallback('N/A', {
  checkFalsy: true,
});
