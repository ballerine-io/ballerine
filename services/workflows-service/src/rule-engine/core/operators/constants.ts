import { EQUALS, BETWEEN, LT, LTE, GT, GTE, LAST_YEAR } from './helpers';

import { OPERATION } from './enums';

export const operationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
} as const;

export type ConditionHelper = (typeof operationHelpers)[keyof typeof operationHelpers];
