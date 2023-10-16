import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import {
  JsonLogicRuleEngine,
  RuleTestResult,
} from '@app/components/organisms/DynamicUI/rule-engines';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { Rule, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { JmespathRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { DestinationRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/destination.rule-engine';

export const useRuleExecutor = (
  context: AnyObject,
  rules: Rule[],
  definition: UIElement<AnyObject>,
  uiState: UIState,
) => {
  const uiStateRef = useRef(uiState);

  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  const [executionResult, setExecutionResult] = useState<RuleTestResult[]>([]);

  const rulesManager = useMemo(
    () =>
      new EngineManager([
        new JsonLogicRuleEngine(),
        new JsonSchemaRuleEngine(),
        new JmespathRuleEngine(),
        new DestinationRuleEngine(),
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
            //@ts-nocheck
            //This hack is neeeded to filter out `empty`
            //TO DO: Find solution on how to define array items in schemas
            // ctx.documents = ctx?.documents.filter(Boolean);

            return engine.test(ctx, rule, definition, uiState);
          }) || [];

        setExecutionResult(executionResult);
      },
    [rulesManager],
  );

  useEffect(() => {
    executeRules(context, rules, definition, uiStateRef.current);
  }, [context, rules, uiStateRef, definition, executeRules]);

  return executionResult;
};
