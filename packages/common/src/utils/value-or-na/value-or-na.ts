import { valueOrFallback } from '@/utils';

/**
 * @description Returns 'N/A' if value is falsy.
 */
export const valueOrNA = valueOrFallback('N/A', {
  checkFalsy: true,
});
