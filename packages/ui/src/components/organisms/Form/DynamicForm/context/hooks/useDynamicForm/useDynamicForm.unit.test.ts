import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DynamicFormContext } from '../../dynamic-form.context';
import { useDynamicForm } from './useDynamicForm';

vi.mock('react', () => ({
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe('useDynamicForm', () => {
  const mockContextValue = {
    values: { field1: 'value1' },
    touched: { field1: true },
    submit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useContext).mockReturnValue(mockContextValue);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call useContext with DynamicFormContext', () => {
    renderHook(() => useDynamicForm());

    expect(useContext).toHaveBeenCalledTimes(1);
    expect(useContext).toHaveBeenCalledWith(DynamicFormContext);
  });

  it('should return context value', () => {
    const { result } = renderHook(() => useDynamicForm());

    expect(result.current).toBe(mockContextValue);
  });
});
