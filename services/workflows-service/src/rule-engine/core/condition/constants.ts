import { EQUALS, BETWEEN, LT, LTE, GT, GTE, LAST_YEAR } from './helpers';

import { ConditionType } from './enums';

export const conditionHelpers = {
  [ConditionType.EQUALS]: EQUALS,
  [ConditionType.BETWEEN]: BETWEEN,
  [ConditionType.GT]: GT,
  [ConditionType.GTE]: GTE,
  [ConditionType.LT]: LT,
  [ConditionType.LTE]: LTE,
  [ConditionType.LAST_YEAR]: LAST_YEAR,
} as const;
