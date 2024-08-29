import {
  JsonLogicSelector,
  ValueApplyValue,
} from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/types';
import { ValueApplySelector } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/action-handlers/value-apply/value-apply.selector.abstract';
import { isObject } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import jsonLogic from 'json-logic-js';

export class ValueApplyJsonLogicSelector implements ValueApplySelector {
  select<TResult>(value: ValueApplyValue, context: AnyObject): TResult {
    if (!this.isJsonLogic(value)) throw new Error('Incorrect selector params.');

    return jsonLogic.apply(value.selector, context) as TResult;
  }

  private isJsonLogic(value: unknown): value is JsonLogicSelector {
    return isObject(value) && value.type === 'jsonLogic';
  }
}
