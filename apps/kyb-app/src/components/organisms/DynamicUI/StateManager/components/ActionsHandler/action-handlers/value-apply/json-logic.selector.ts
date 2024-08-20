import {
  JsonLogicSelector,
  ValueApplyValue,
} from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { ValueApplySelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.selector.abstract';
import jsonLogic from 'json-logic-js';

export class ValueApplyJsonLogicSelector implements ValueApplySelector {
  select<TResult>(value: ValueApplyValue, context: any): TResult {
    if (!this.isJsonLogic(value)) throw new Error('Incorrect selector params.');

    return jsonLogic.apply(value.selector, context) as TResult;
  }

  private isJsonLogic(value: unknown): value is JsonLogicSelector {
    return (
      typeof value === 'object' && value !== null && 'type' in value && value.type === 'jsonLogic'
    );
  }
}
