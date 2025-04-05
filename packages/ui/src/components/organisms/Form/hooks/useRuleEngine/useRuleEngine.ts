import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IRule, IRuleExecutionResult, TRuleEngine } from './types';
import { executeRules } from './utils/execute-rules';

export interface IRuleEngineParams<TRuleEngines = TRuleEngine> {
  rules?: Array<IRule<TRuleEngines>> | IRule<TRuleEngines>;
  executeRulesSync?: boolean;
  runOnInitialize?: boolean;
  executionDelay?: number;
}

export const useRuleEngine = <TRuleEngines = TRuleEngine>(
  context: object,
  params: IRuleEngineParams<TRuleEngines>,
): IRuleExecutionResult[] => {
  const { executeRulesSync, rules: _rules, runOnInitialize = false, executionDelay = 500 } = params;

  const [asyncRuleEngineExecutionResults, setAsyncRuleEngineExecutionResults] = useState<
    IRuleExecutionResult[]
  >(() =>
    runOnInitialize && !executeRulesSync
      ? executeRules(
          context,
          Array.isArray(_rules) ? _rules?.filter(Boolean) : _rules ? [_rules] : [],
        )
      : [],
  );

  const rules = useMemo(() => (Array.isArray(_rules) ? _rules : _rules ? [_rules] : []), [_rules]);

  const syncRuleEngineExecutionResults = useMemo(() => {
    if (!executeRulesSync) {
      return [];
    }

    const results = executeRules(context, rules);

    if (results.length) {
      console.debug('Executed rules synchronously', results);
    }

    return results;
  }, [rules, context, executeRulesSync]);

  const executeRulesDebounced = useCallback(
    debounce((context: object, rules: Array<IRule<any, any>>) => {
      const results = executeRules(context, rules);

      if (results?.length) {
        console.debug('Executed rules asynchronously', results);
      }

      setAsyncRuleEngineExecutionResults(results);
    }, executionDelay),
    [executionDelay],
  );

  useEffect(() => {
    if (executeRulesSync) {
      return;
    }

    executeRulesDebounced(context, rules);
  }, [context, rules, executeRulesSync, executeRulesDebounced]);

  return executeRulesSync ? syncRuleEngineExecutionResults : asyncRuleEngineExecutionResults;
};
