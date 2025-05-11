import { OPERATION } from './enums';

export { BaseOperator } from './helpers';

export {
  AML_CHECK,
  BETWEEN,
  EQUALS,
  EXISTS,
  FUZZY_MATCH_SCORE_LT,
  GT,
  GTE,
  IN,
  IN_CASE_INSENSITIVE,
  LAST_YEAR,
  LT,
  LTE,
  NOT_EQUALS,
  NOT_IN,
  UBO_MISMATCH,
} from './helpers';

export { AML_CHECK_V2 } from './aml-v2-check';
export { COMPANY_SANCTIONS_CATEGORIES } from './company-sanctions-by-category';
export { IDV_CHECK } from './idv-check';

export const OPERATORS_WITHOUT_PATH_COMPARISON = [
  OPERATION.AML_CHECK,
  OPERATION.AML_CHECK_V2,
  OPERATION.BETWEEN,
  OPERATION.LAST_YEAR,
  OPERATION.IDV_CHECK,
  OPERATION.COMPANY_SANCTIONS_CATEGORIES,
] as const;

export const OPERATORS_WITH_THRESHOLD = [OPERATION.FUZZY_MATCH_SCORE_LT] as const;

export type TUnifiedApiClient = {
  runEntityMatchingV2: (payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) => Promise<{ data: { similarityScore: number & Record<string, unknown> } }>;
};
