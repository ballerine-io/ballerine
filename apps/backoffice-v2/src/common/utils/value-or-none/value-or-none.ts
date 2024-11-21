import { valueOrFallback } from '@ballerine/common';

export const valueOrNone = valueOrFallback('None', { checkFalsy: true });
