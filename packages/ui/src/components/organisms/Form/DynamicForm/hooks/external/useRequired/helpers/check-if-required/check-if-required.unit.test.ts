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

    const result = checkIfRequired(element, {});

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

    const result = checkIfRequired(element, {});

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

    const result = checkIfRequired(element, {});

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
          considerRequred: true,
          value: {},
          message: 'Field is required',
        },
      ] as unknown as IFormElement['validate'],
    };

    const result = checkIfRequired(element, {});

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
            type: 'json-logic',
            value: { '==': [{ var: 'someField' }, true] },
          },
        },
      ],
    };

    const context = { someField: true };

    mockedExecuteRules.mockReturnValue([{ result: true }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, context);

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
            type: 'json-logic',
            value: { '==': [{ var: 'someField' }, true] },
          },
        },
      ],
    };

    const context = { someField: false };

    mockedExecuteRules.mockReturnValue([{ result: false, rule: {} }] as IRuleExecutionResult[]);

    const result = checkIfRequired(element, context);

    expect(result).toBe(false);
    expect(mockedExecuteRules).toHaveBeenCalledWith(context, [
      {
        engine: 'json-logic',
        value: { '==': [{ var: 'someField' }, true] },
      },
    ]);
  });
});
