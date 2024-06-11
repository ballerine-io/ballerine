import { valueOrFallback } from '@/common/utils/value-or-fallback/value-or-fallback';

export const valueOrNone = valueOrFallback('None', { checkFalsy: true });
