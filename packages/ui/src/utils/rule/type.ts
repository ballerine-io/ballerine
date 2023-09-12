type ElementEventTypes = 'onClick' | 'onChange'
type ElementEventRule = {
  eventType: ElementEventTypes
  elementName: string
}
type BaseRule = {
  onRuleTrue: () => void
};

export type UiEventRule = BaseRule & {
  engine: 'event';
  logic: Array<ElementEventRule>;
};

export type JmesPathRule = BaseRule & {
  engine: 'jmespath';
  logic: string;
};

export type JsonLogicRule = BaseRule & {
  engine: 'json-logic';
  logic: Array<Record<string, unknown>>;
};
// information of runtime -
// everyt time somethign hits "onChange/onClick" - you run the rule over the runtime information
//

export type Rule = UiEventRule | JmesPathRule | JsonLogicRule;
