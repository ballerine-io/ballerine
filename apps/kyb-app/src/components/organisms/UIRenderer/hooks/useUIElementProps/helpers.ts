import { Rule } from '@/domains/collection-flow';

export const injectIndexesAtRulesPaths = (rules: Rule[], index: number | null = null) => {
  if (index === null) return rules;

  if (!Array.isArray(rules)) return rules;

  const result = rules.map(rule => {
    if (rule.type === 'json-logic') {
      const stringValue = JSON.stringify(rule.value);
      const newValue = JSON.parse(
        stringValue.replace(/\[({INDEX})\]/g, (match, p1, offset, string) => {
          const before = string[offset - 1];
          const after = string[offset + match.length];
          const prefix = before && before !== '.' ? '.' : '';
          const suffix = after && after !== '.' ? '.' : '';

          return `${prefix}${index}${suffix}`;
        }),
      );

      return {
        ...rule,
        value: newValue,
      };
    }

    return rule;
  });

  return result;
};
