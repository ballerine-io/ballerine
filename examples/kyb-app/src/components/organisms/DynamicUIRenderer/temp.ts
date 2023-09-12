import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';

export type UIElementType = 'text' | 'button';

export type BaseRuleValue = string;
export type EventRuleValue = {
  event: 'onClick' | 'onChange';
  uiElementName: string;
};

export interface BaseRule {
  engine: 'json-logic' | 'jmespath' | 'event';
}

export interface Rule extends BaseRule {
  value: string;
}

export interface EventRule extends BaseRule {
  value: EventRuleValue;
}

export interface Action<TParams = AnyObject> {
  type: string;
  invokeOn: (Rule | EventRule)[];
  params: TParams;
}

export interface UIElement<TElementParams> {
  name: string;
  type: UIElementType;
  activeOn: Rule[];
  validationSchema?: RJSFSchema | null;
  required?: boolean;
  inputParams: TElementParams;
}

type PageKey = string;

interface PageParams {
  fieldOptions: Record<string, any[]>;
  somethingElse?: string;
}

interface Context {
  page: PageKey;
  pageParams: Record<PageKey, PageParams>;
  payload: Record<PageKey, AnyObject>;
}

export const definitions: UIElement<any>[] = [
  {
    name: 'firstName',
    type: 'text',
    activeOn: [],
    required: true,
    validationSchema: {
      type: 'string',
    },
    inputParams: {
      placeholder: 'John',
      title: 'First Name',
    },
  },
  {
    name: 'lastName',
    type: 'text',
    activeOn: [
      {
        engine: 'json-logic',
        value: `{
        "if": [
          { "var": "context.payload.firstName" },
          true,
          false
        ]
      }`,
      },
    ],
    inputParams: {
      placeholder: 'Doe',
      title: 'Last Name',
    },
  },
  {
    name: 'submit',
    type: 'button',
    inputParams: {
      label: 'Submit',
    },
    activeOn: [
      {
        engine: 'json-logic',
        value: `{
        "and": [
          {"var": "context.payload.firstName"},
          {"var": "context.payload.lastName"}
        ]
      }`,
      },
    ],
  },
];

export const actions: Action[] = [
  {
    type: 'api',
    invokeOn: [
      {
        engine: 'event',
        value: { event: 'onClick', uiElementName: 'submit' },
      },
    ],
    params: {
      url: 'https://google.com/gay/porn',
      method: 'post',
      type: 'json', // could be formData when Files present?
      map: {
        toBody: `{qwerty: "123"}`,
        fromResponse: `{}`,
        toContext: '{}',
      },
    },
  },
];
