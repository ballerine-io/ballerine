export const OPERATION = {
  EQUALS: 'EQUALS',
  NOT_EQUALS: 'NOT_EQUALS',
  BETWEEN: 'BETWEEN',
  GT: 'GT',
  LT: 'LT',
  GTE: 'GTE',
  LTE: 'LTE',
  LAST_YEAR: 'LAST_YEAR',
  EXISTS: 'EXISTS',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
} as const;

export const OPERATOR = {
  AND: 'and',
  OR: 'or',
} as const;
