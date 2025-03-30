import { IRuleExecutionResult } from '@/components/organisms/Form/hooks';
import { executeRules } from '@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules';
import { TBaseValidators } from '@/components/organisms/Form/Validator';
import { describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../../../../types';
import { checkIfRequired } from './check-if-required';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine/utils/execute-rules');

const mockedExecuteRules = vi.mocked(executeRules);

describe('checkIfRequired', () => {
  it('should return false when there are no validators', () => {
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(false);
  });

  it('should return false when there are no required validators', () => {
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'custom' as TBaseValidators,
          value: {},
          message: 'Custom message',
        },
      ],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(false);
  });

  it('should return true when there is a required validator with no conditions', () => {
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'required',
          value: {},
          message: 'Field is required',
        },
      ],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(true);
  });

  it('should return true when there is a considerRequired validator with no conditions', () => {
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'custom',
          considerRequired: true,
          value: {},
          message: 'Field is required',
        },
      ] as unknown as IFormElement['validate'],
    };

    const result = checkIfRequired(element, {}, []);

    expect(result).toBe(true);
  });

  it('should evaluate applyWhen conditions when present', () => {
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'required',
          value: {},
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
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'required',
          value: {},
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
    const element: IFormElement = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
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
