type Rule = {
  id: string;
  name: string;
  domain: string;
  ruleType: 'evaluate' | 'uboHasWarning';
  options: {
    fieldPath?: string;
    cast?: 'String' | 'Number' | 'Boolean' | 'Date';
    operations?: 'greater_than' | 'less_than' | 'equal' | 'not_equal' | 'contains' | 'not_contains';
    value?: string | number | boolean | undefined | Date;
  };
};

type RuleSet = {
  id: string;
  name: string;
  rules: Rule[];
};

type RuleGroup = {
  id: string;
  name: string;
  ruleSets: RuleSet[];
  joiner: 'and' | 'or';
  joinerGroupId: string[];
};

const calculateRiskScore = (ruleSets: RuleSet[], context: Record<string, any>) => {
  ruleSets.map(ruleSet => {
    ruleSet.rules.map(rule => {
      try {
        if (rule.ruleType === 'evaluate') {
          return evaluate(rule, context);
        } else if (rule.ruleType === 'uboHasWarning') {
          return uboHasWarning(rule, context);
        }
      } catch (e) {
        console.error(e);

        return { success: false };
      }
    });
  });
};

const castTargetValue = (options: Rule['options'], value: string) => {
  switch (options.cast) {
    case 'String':
      return String(value);
    case 'Number':
      return Number(value);
    case 'Boolean':
      return Boolean(value);
    case 'Date':
      return new Date(value);
    default:
      return value;
  }
};

const castCompareValue = (options: Rule['options'], value: string) => {
  if (value.startsWith('`') && value.endsWith('`')) {
    return castTargetValue(options, eval(value));
  }

  return castTargetValue(options, value);
};

const evaluate = (
  { id, options }: Rule & { options: { fieldPath: string; value: string } },
  context: Record<string, any>,
) => {
  const fieldValue = context.entity[options.fieldPath];

  const formattedTargetValue = castTargetValue(options, fieldValue);
  const formattedCompareValue = castCompareValue(options, fieldValue);

  switch (options.operations) {
    case 'equal':
      return { id, success: formattedTargetValue === formattedCompareValue };
    case 'not_equal':
      return { id, success: formattedTargetValue !== formattedCompareValue };
    case 'contains':
      if (!(typeof formattedCompareValue === 'string' || Array.isArray(formattedCompareValue))) {
        return { success: false };
      }

      if (Array.isArray(formattedCompareValue)) {
        return { id, success: formattedCompareValue.includes(formattedTargetValue) };
      }

      return { id, success: formattedCompareValue.includes(String(formattedTargetValue)) };
    case 'not_contains':
      if (!(typeof formattedCompareValue === 'string' || Array.isArray(formattedCompareValue))) {
        return { success: false };
      }

      if (Array.isArray(formattedCompareValue)) {
        return { id, success: !formattedCompareValue.includes(formattedTargetValue) };
      }

      return { id, success: !formattedCompareValue.includes(String(formattedTargetValue)) };
    case 'greater_than':
      return { id, success: fieldValue > options.value };
    case 'less_than':
      return { id, success: fieldValue < options.value };
    default:
      return { success: true };
  }
};

const uboHasWarning = ({ id }: Rule, context: Record<string, any>) => {
  if (context.entity.ubos.any(ubo => ubo.warnings.length > 0)) return { id, success: true };

  return { success: true };
};
