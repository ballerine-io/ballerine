import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSubmit } from './useSubmit';

describe('useSubmit', () => {
  const mockValues = {
    field1: 'value1',
    field2: 'value2',
  };

  const mockOnSubmit = vi.fn();

  const setup = (params = {}) => {
    return renderHook(() =>
      useSubmit({
        onSubmit: mockOnSubmit,
        ...params,
      }),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return submit function', () => {
    const { result } = setup();

    expect(result.current).toHaveProperty('submit');
    expect(typeof result.current.submit).toBe('function');
  });

  it('should call onSubmit with values when submit is called', () => {
    const { result } = setup();

    result.current.submit(mockValues);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(mockValues);
  });

  it('should not throw when onSubmit is not provided', () => {
    const { result } = setup({ onSubmit: undefined });

    expect(() => result.current.submit(mockValues)).not.toThrow();
  });

  it('should memoize submit function', () => {
    const { result, rerender } = setup();

    const firstSubmit = result.current.submit;

    rerender();

    expect(result.current.submit).toBe(firstSubmit);
  });
});
