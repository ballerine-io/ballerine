import { BaseActionParams, Rule } from '@/domains/collection-flow';

export type ValueApplySelectorType = 'raw' | 'json-logic' | 'pick';

export interface RawSelector<TValue = unknown> {
  type: 'raw';
  value: TValue;
}

export interface PickSelector {
  type: 'pick';
  pickDestination: string;
  defaultValue?: unknown;
}

export interface JsonLogicSelector {
  type: 'json-logic';
  value: object;
}

export type ValueApplySelectors = RawSelector | PickSelector | JsonLogicSelector;

export interface ValueApplyValue {
  valueDestination: string;
  selector: ValueApplySelectors;
  rule: Rule[];
}

export interface ValueApplyParams extends BaseActionParams {
  values: ValueApplyValue[];
}
