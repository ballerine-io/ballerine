import {
  EQUALS,
  NOT_EQUALS,
  BETWEEN,
  LT,
  LTE,
  GT,
  GTE,
  LAST_YEAR,
  EXISTS,
  IN,
  NOT_IN,
} from './helpers';

import { OPERATION } from './enums';

export const OperationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.NOT_EQUALS]: NOT_EQUALS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
  [OPERATION.EXISTS]: EXISTS,
  [OPERATION.IN]: IN,
  [OPERATION.NOT_IN]: NOT_IN,
} as const;

export type OperationHelper = (typeof OperationHelpers)[keyof typeof OperationHelpers];
