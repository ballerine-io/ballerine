import { testRule } from '@/components/organisms/DynamicUI/rule-engines/utils/execute-rules';
import { ActionHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/action-handler.abstract';
import { ValueApplyJsonLogicSelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/json-logic.selector';
import { ValueApplyPickSelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/pick.selector';
import { ValueApplyRawSelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/raw.selector';
import {
  ValueApplyParams,
  ValueApplySelectors,
} from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { ValueApplySelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.selector.abstract';
import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { Action } from '@/domains/collection-flow';
import set from 'lodash/set';

export class ValueApplyHandler implements ActionHandler {
  readonly ACTION_TYPE = 'valueApply';

  async run<TContext>(
    _: TContext,
    action: Action<ValueApplyParams>,
    api: StateMachineAPI,
  ): Promise<TContext> {
    const context = structuredClone(api.getContext());

    action?.params?.values?.forEach(params => {
      const { valueDestination, selector: selectorParams, rule } = params;
      const isCanRun = rule?.length && rule.every(rule => testRule(context, rule));

      if (!isCanRun) return;

      const selectorEngine = this.getSelector(selectorParams);

      const value = selectorEngine.select(params, context);
      console.log(`ValueApplyHandler: valueDestination: ${valueDestination}, value: ${value}`);

      set(context, valueDestination, value);
    });

    api.setContext(context);

    return Promise.resolve(api.getContext()) as Promise<TContext>;
  }

  private getSelector(selectorType: ValueApplySelectors): ValueApplySelector {
    const selectorsMap = {
      raw: new ValueApplyRawSelector(),
      pick: new ValueApplyPickSelector(),
      'json-logic': new ValueApplyJsonLogicSelector(),
    };

    const selector = selectorsMap[selectorType.type];

    if (!selector) throw new Error('Incorrect selector type');

    return selector;
  }
}
