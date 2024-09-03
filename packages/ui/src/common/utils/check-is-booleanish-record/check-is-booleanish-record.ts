import { isType } from '@ballerine/common';
import { BooleanishSchema } from '@/common/schemas';

export const checkIsBooleanishRecord = isType(BooleanishSchema);
