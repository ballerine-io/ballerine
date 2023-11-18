import { AnyObject } from '@ballerine/ui';

export type UIElementType = string;

export type BaseRuleValue = string;
export type EventRuleValue = {
  event: 'onClick' | 'onChange';
  uiElementName: string;
};

export interface BaseRule {
  type: 'json-logic' | 'jmespath' | 'event' | 'documents-validator';
}

export interface JSONLogicRule extends BaseRule {
  value: AnyObject;
}
export interface DocumentsValidatorRule extends BaseRule {
  value: {
    documentId: string;
    destination: string;
    required: boolean | Rule;
    errorMessage: string;
  }[];
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

export interface BaseActionParams {
  debounce?: number;
}

export interface Action<TParams = BaseActionParams> {
  type: string;
  dispatchOn: {
    uiEvents: { event: string; uiElementName: string }[];
    rules: Rule[];
  };
  params: TParams;
}

export type Rule = JSONLogicRule | JMESPathRule | DocumentsValidatorRule;

export type UIElementDestination = string;

export interface UIElement<TElementParams = AnyObject> {
  name: string;
  type: UIElementType;
  availableOn?: Rule[];
  visibleOn?: Rule[];
  required?: boolean;
  options: TElementParams;
  valueDestination?: UIElementDestination;
  elements?: UIElement<AnyObject>[];
}
