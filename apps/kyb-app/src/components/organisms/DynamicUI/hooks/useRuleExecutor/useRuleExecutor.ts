import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { RuleTestResult } from '@/components/organisms/DynamicUI/rule-engines';
import { executeRule } from '@/components/organisms/DynamicUI/rule-engines/utils/execute-rules';
import { Rule, UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useRuleExecutor = (
  context: AnyObject,
  rules: Rule[],
  definition: UIElement<AnyObject>,
  uiState: UIState,
) => {
  const uiStateRef = useRef(uiState);
  const { currentPage } = usePageResolverContext();

  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  const [executionResult, setExecutionResult] = useState<RuleTestResult[]>([]);

  const executeRules = useMemo(
    () =>
      (context: AnyObject, rules: Rule[], definition: UIElement<AnyObject>, uiState: UIState) => {
        const executionResult =
          rules?.map(rule => {
            const ctx = { ...context };

            //This hack is neeeded to filter out `empty`
            //TO DO: Find solution on how to define array items in schemas
            // ctx.documents = ctx?.documents.filter(Boolean);

            return executeRule(ctx, rule, definition, uiState, currentPage!);
          }) || [];

        // @ts-ignore
        setExecutionResult(executionResult);
      },
    [currentPage],
  );

  useEffect(() => {
    executeRules(context, rules, definition, uiStateRef.current);
  }, [context, rules, uiStateRef, definition, currentPage, executeRules]);

  if (import.meta.env.MODE === 'development') {
    if (executionResult.length && executionResult.every(r => !r.isValid && r.errors?.length)) {
      console.log('Rules execution result', executionResult);
    }
  }

  return executionResult;
};
