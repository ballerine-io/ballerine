import { EQUALS, NOT_EQUALS, BETWEEN, LT, LTE, GT, GTE, LAST_YEAR, EXISTS } from './helpers';

import { OPERATION } from './enums';

export const operationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.NOT_EQUALS]: NOT_EQUALS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
  [OPERATION.EXISTS]: EXISTS,
} as const;

export type OperationHelper = (typeof operationHelpers)[keyof typeof operationHelpers];
