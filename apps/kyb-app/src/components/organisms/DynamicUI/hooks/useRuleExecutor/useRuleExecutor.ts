import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { JsonLogicRuleEngine, RuleTestResult } from '@/components/organisms/DynamicUI/rule-engines';
import { DocumentsRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/documents.rule-engine';
import { IsStepValidRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/is-step-valid.rule-engine';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
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

  const rulesManager = useMemo(
    () =>
      new EngineManager([
        new JsonLogicRuleEngine(),
        // @ts-ignore
        new JsonSchemaRuleEngine(),
        new JmespathRuleEngine(),
        new DocumentsRuleEngine(),
        new IsStepValidRuleEngine(),
      ]),
    [],
  );

  const executeRules = useMemo(
    () =>
      (context: AnyObject, rules: Rule[], definition: UIElement<AnyObject>, uiState: UIState) => {
        const executionResult =
          rules?.map(rule => {
            const engine = rulesManager.getEngine(rule.type);

            const ctx = { ...context };

            //This hack is neeeded to filter out `empty`
            //TO DO: Find solution on how to define array items in schemas
            // ctx.documents = ctx?.documents.filter(Boolean);

            return engine?.validate(ctx, rule, definition, uiState, currentPage!);
          }) || [];

        // @ts-ignore
        setExecutionResult(executionResult);
      },
    [rulesManager, currentPage],
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
