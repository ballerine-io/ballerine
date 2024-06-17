export type CustomRuleInput = {
  type: 'evaluate' | 'uboHasWarning';
  options: {
    fieldPath?: string;
    cast?: 'String' | 'Number' | 'Boolean' | 'Date';
    operations?: 'greater_than' | 'less_than' | 'equal' | 'not_equal' | 'contains' | 'not_contains';
    compareValue?: string;
  };
};
