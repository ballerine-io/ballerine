import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStack } from '../../../fields';
import { checkIfRequired } from './helpers/check-if-required';
import { useRequired } from './useRequired';

vi.mock('../../../fields', () => ({
  useStack: vi.fn(),
}));

vi.mock('./helpers/check-if-required', () => ({
  checkIfRequired: vi.fn(),
}));

const mockedUseStack = vi.mocked(useStack);
const mockedCheckIfRequired = vi.mocked(checkIfRequired);

describe('useRequired', () => {
  it('should return isRequired value from checkIfRequired', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [1, 2];

    mockedUseStack.mockReturnValue({ stack });
    mockedCheckIfRequired.mockReturnValue(true);

    const { result } = renderHook(() => useRequired(element, context));

    expect(result.current).toBe(true);
    expect(mockedCheckIfRequired).toHaveBeenCalledWith(element, context, stack);
  });

  it('should memoize the result', () => {
    const element = {
      id: 'test',
      element: 'test',
      valueDestination: 'test',
    };
    const context = { someField: true };
    const stack = [1, 2];

    mockedUseStack.mockReturnValue({ stack });
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

    mockedUseStack.mockReturnValue({ stack });
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
    expect(mockedCheckIfRequired).toHaveBeenLastCalledWith(element, newContext, stack);
  });
});
