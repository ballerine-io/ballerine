import { IRuleExecutionResult } from '@/components/organisms/Form/hooks';
import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { describe, expect, it, vi } from 'vitest';
import { checkIfRequired } from './check-if-required';
import { TUIElement } from '@ballerine/common';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules');

const mockedExecuteRules = vi.mocked(executeRules);

describe('checkIfRequired', () => {
  it('should return false when there are no validators', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(false);
  });

  it('should return false when there are no required validators', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [
        {
          type: 'minimum',
          value: { minimum: 1 },
          message: 'Custom message',
        },
      ],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(false);
  });

  it('should return true when there is a required validator with no conditions', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [
        {
          type: 'required',
          message: 'Field is required',
        },
      ],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(true);
  });

  it('should return true when there is a considerRequired validator with no conditions', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [
        {
          type: 'custom',
          considerRequired: true,
          value: {},
          message: 'Field is required',
        },
      ] as unknown as TUIElement['validate'],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(true);
  });

  it('should evaluate applyWhen conditions when present', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [
        {
          type: 'required',
          message: 'Field is required',
          applyWhen: {
            engine: 'json-logic',
            value: { '==': [{ var: 'someField' }, true] },
          },
        },
      ],
    };

    const context = { someField: true };
    const stack = [1, 2];

    mockedExecuteRules.mockReturnValue([{ result: true }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, context, stack);

    expect(result).toBe(true);
    expect(mockedExecuteRules).toHaveBeenCalledWith(context, [
      {
        engine: 'json-logic',
        value: { '==': [{ var: 'someField' }, true] },
      },
    ]);
  });

  it('should return false when applyWhen condition evaluates to false', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
      validate: [
        {
          type: 'required',
          message: 'Field is required',
          applyWhen: {
            engine: 'json-logic',
            value: { '==': [{ var: 'someField' }, true] },
          },
        },
      ],
    };

    const context = { someField: false };
    const stack = [1, 2];

    mockedExecuteRules.mockReturnValue([{ result: false, rule: {} }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, context, stack);

    expect(result).toBe(false);
    expect(mockedExecuteRules).toHaveBeenCalledWith(context, [
      {
        engine: 'json-logic',
        value: { '==': [{ var: 'someField' }, true] },
      },
    ]);
  });

  it('should return true only if globalValidationRules are present', () => {
    const element: TUIElement = {
      id: 'test',
      element: 'textfield',
      valueDestination: 'test',
      params: {},
    };

    const globalValidationRules = [
      {
        type: 'required',
        value: {},
        message: 'Field is required',
      },
    ];

    const result = checkIfRequired(element, {}, [], globalValidationRules);

    expect(result).toBe(true);
  });
});
