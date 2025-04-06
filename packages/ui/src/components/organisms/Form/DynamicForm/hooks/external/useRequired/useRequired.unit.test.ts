import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields';
import { IFormElement } from '../../../types';
import { checkIfRequired } from './helpers/check-if-required';
import { useRequired } from './useRequired';

vi.mock('../../../context', () => ({
  useDynamicForm: vi.fn(),
}));

vi.mock('../../../fields', () => ({
  useStack: vi.fn(),
}));

vi.mock('./helpers/check-if-required', () => ({
  checkIfRequired: vi.fn(),
}));

const mockedUseDynamicForm = vi.mocked(useDynamicForm);
const mockedUseStack = vi.mocked(useStack);
const mockedCheckIfRequired = vi.mocked(checkIfRequired);

describe('useRequired', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDynamicForm.mockReturnValue({
      validationParams: {
        globalValidationRules: [
          {
            type: 'required',
            value: {},
            message: 'This field is required',
          },
        ],
      },
      metadata: {},
    } as ReturnType<typeof useDynamicForm>);
  });

  it('should return isRequired value from checkIfRequired', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
      validate: [
        {
          type: 'required',
          value: {},
          message: 'This field is required',
        },
      ],
    } as unknown as IFormElement<string, object>;
    const context = { someField: true };
    const stack = [1, 2];
    const metadata = { meta: 'data' };

    mockedUseStack.mockReturnValue({ stack });
    mockedUseDynamicForm.mockReturnValue({
      validationParams: {},
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);
    mockedCheckIfRequired.mockReturnValue(true);

    const { result } = renderHook(() => useRequired(element, context));

    expect(result.current).toBe(true);
    expect(mockedCheckIfRequired).toHaveBeenCalledWith(
      element,
      { ...context, ...metadata },
      stack,
      undefined,
    );
  });

  it('should memoize the result', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [1, 2];
    const metadata = { meta: 'data' };

    mockedUseStack.mockReturnValue({ stack });
    mockedUseDynamicForm.mockReturnValue({
      validationParams: {},
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);
    mockedCheckIfRequired.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useRequired(element, context));

    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(1);

    rerender();

    expect(result.current).toBe(true);
    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(1);
  });

  it('should recalculate when dependencies change', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [1, 2];
    const metadata = { meta: 'data' };

    mockedUseStack.mockReturnValue({ stack });
    mockedUseDynamicForm.mockReturnValue({
      validationParams: {},
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);
    mockedCheckIfRequired.mockReturnValue(true);

    const { result, rerender } = renderHook(
      ({ element, context }) => useRequired(element, context),
      {
        initialProps: { element, context },
      },
    );

    expect(result.current).toBe(true);
    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(1);

    const newContext = { someField: false };
    rerender({ element, context: newContext });

    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(2);
    expect(mockedCheckIfRequired).toHaveBeenLastCalledWith(
      element,
      { ...newContext, ...metadata },
      stack,
      undefined,
    );
  });

  it('should recalculate when validation params change', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [1, 2];
    const metadata = { meta: 'data' };

    mockedUseStack.mockReturnValue({ stack });
    mockedUseDynamicForm.mockReturnValue({
      validationParams: { globalValidationRules: undefined },
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);
    mockedCheckIfRequired.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useRequired(element, context));

    expect(result.current).toBe(true);
    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(1);
    expect(mockedCheckIfRequired).toHaveBeenCalledWith(
      element,
      { ...context, ...metadata },
      stack,
      undefined,
    );

    // Change validation rules
    const newValidationRules = [
      {
        type: 'required',
        value: {},
        message: 'This field is required',
      },
    ];
    mockedUseDynamicForm.mockReturnValue({
      validationParams: { globalValidationRules: newValidationRules },
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);

    // Rerender with the new validation rules
    rerender();

    expect(mockedCheckIfRequired).toHaveBeenCalledTimes(2);
    expect(mockedCheckIfRequired).toHaveBeenLastCalledWith(
      element,
      { ...context, ...metadata },
      stack,
      newValidationRules,
    );
  });

  it('should pass globalValidationRules to checkIfRequired', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [0, 1];
    const globalValidationRules = [
      {
        type: 'required',
        value: { fields: ['test'] },
        message: 'Field is required',
      },
    ];
    const metadata = { userId: '123' };

    mockedUseStack.mockReturnValue({ stack });
    mockedUseDynamicForm.mockReturnValue({
      validationParams: { globalValidationRules },
      metadata,
    } as unknown as ReturnType<typeof useDynamicForm>);
    mockedCheckIfRequired.mockReturnValue(true);

    renderHook(() => useRequired(element, context));

    expect(mockedCheckIfRequired).toHaveBeenCalledWith(
      element,
      { ...context, ...metadata },
      stack,
      globalValidationRules,
    );
  });
});
