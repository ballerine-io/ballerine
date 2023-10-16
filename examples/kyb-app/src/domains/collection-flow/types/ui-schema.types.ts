import { AnyObject } from '@ballerine/ui';

export type UIElementType = string;

export type BaseRuleValue = string;
export type EventRuleValue = {
  event: 'onClick' | 'onChange';
  uiElementName: string;
};

export interface BaseRule {
  type: 'json-logic' | 'jmespath' | 'event';
}

export interface JSONLogicRule extends BaseRule {
  value: AnyObject;
}

export interface CustomRule extends BaseRule {
  value: AnyObject;
}

export interface JMESPathRule extends BaseRule {
  value: string;
}

export interface IRule extends BaseRule {
  value: string;
  persistStateRule?: boolean;
}

export interface EventRule extends BaseRule {
  value: EventRuleValue;
}

export interface Action<TParams = AnyObject> {
  type: string;
  dispatchOn: {
    uiEvents: { event: string; uiElementName: string }[];
    rules: Rule[];
  };
  params: TParams;
}

export type Rule = JSONLogicRule | JMESPathRule | CustomRule;

export type UIElementDestination = string;

export interface UIElement<TElementParams> {
  name: string;
  type: UIElementType;
  availableOn?: Rule[];
  visibleOn?: Rule[];
  required?: boolean;
  options: TElementParams;
  valueDestination?: UIElementDestination;
  elements?: UIElement<AnyObject>[];
}
