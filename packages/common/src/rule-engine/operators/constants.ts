import {
  AML_CHECK,
  BETWEEN,
  EQUALS,
  GT,
  GTE,
  IN,
  IN_CASE_INSENSITIVE,
  LAST_YEAR,
  LT,
  LTE,
  NOT_EQUALS,
  EXISTS,
  NOT_IN,
  FUZZY_MATCH_SCORE_LT,
  UBO_MATCH,
} from './helpers';

import { OPERATION } from './enums';

export const OperationHelpers = {
  [OPERATION.EQUALS]: EQUALS,
  [OPERATION.NOT_EQUALS]: NOT_EQUALS,
  [OPERATION.EXISTS]: EXISTS,
  [OPERATION.BETWEEN]: BETWEEN,
  [OPERATION.GT]: GT,
  [OPERATION.GTE]: GTE,
  [OPERATION.LT]: LT,
  [OPERATION.LTE]: LTE,
  [OPERATION.LAST_YEAR]: LAST_YEAR,
  [OPERATION.IN]: IN,
  [OPERATION.IN_CASE_INSENSITIVE]: IN_CASE_INSENSITIVE,
  [OPERATION.NOT_IN]: NOT_IN,
  [OPERATION.AML_CHECK]: AML_CHECK,
  [OPERATION.FUZZY_MATCH_SCORE_LT]: FUZZY_MATCH_SCORE_LT,
  [OPERATION.UBO_MATCH]: UBO_MATCH,
} as const;

export const OPERATORS_WITHOUT_PATH_COMPARISON = [
  OPERATION.AML_CHECK,
  OPERATION.BETWEEN,
  OPERATION.LAST_YEAR,
  OPERATION.UBO_MATCH,
] as const;

export const OPERATORS_WITH_THRESHOLD = [OPERATION.FUZZY_MATCH_SCORE_LT] as const;

export type TUnifiedApiClient = {
  runEntityMatchingV2: (payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) => Promise<{ data: { similarityScore: number & Record<string, unknown> } }>;
};
