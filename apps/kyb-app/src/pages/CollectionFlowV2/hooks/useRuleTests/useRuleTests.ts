import { testRule } from '@/components/organisms/DynamicUI/rule-engines/utils/execute-rules';
import { Rule } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useRulesTest = (context: AnyObject, rules: Rule[], scope?: string) => {
  const testResult = useMemo(() => {
    console.log(`${scope ? `${scope}: ` : ''}Testing rules: ${JSON.stringify(rules)}`);

    const results = rules.map(rule => {
      console.log(`Executing rule ${JSON.stringify(rule)}`);

      const executionResult = testRule(context, rule);

      console.log(
        `Result of executing rule ${JSON.stringify(rule)}: ${JSON.stringify(executionResult)}`,
      );

      return executionResult;
    });

    const isPassed = results.every(result => result);

    console.log(`Rules test result passed: ${isPassed}`);

    return isPassed;
  }, [context, rules]);

  return testResult;
};
