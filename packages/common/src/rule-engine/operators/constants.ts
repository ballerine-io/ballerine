import { EQUALS, BETWEEN, LT, LTE, GT, GTE, LAST_YEAR, EXISTS } from './helpers';

import { OPERATION } from './enums';

export const OperationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
  [OPERATION.EXISTS]: EXISTS,
} as const;

export type OperationHelper = (typeof OperationHelpers)[keyof typeof OperationHelpers];
