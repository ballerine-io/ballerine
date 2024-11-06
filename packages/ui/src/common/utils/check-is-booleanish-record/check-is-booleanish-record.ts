import { isType } from '@ballerine/common';
import { BooleanishRecordSchema } from '@/common/schemas';

export const checkIsBooleanishRecord = isType(BooleanishRecordSchema);
