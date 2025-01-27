import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../../types';
import { checkIfRequired } from './helpers/check-if-required';
import { useRequired } from './useRequired';

vi.mock('./helpers/check-if-required', () => ({
  checkIfRequired: vi.fn(),
}));

describe('useRequired', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockElement = {
    validate: [{ type: 'required' }],
  } as IFormElement;

  const mockContext = { someContext: 'value' };

  it('should return the result from checkIfRequired', () => {
    vi.mocked(checkIfRequired).mockReturnValue(true);

    const { result } = renderHook(() => useRequired(mockElement, mockContext));

    expect(checkIfRequired).toHaveBeenCalledWith(mockElement, mockContext);
    expect(result.current).toBe(true);
  });

  it('should memoize the result', () => {
    vi.mocked(checkIfRequired).mockReturnValue(true);

    const { result, rerender } = renderHook(
      ([element, context]) => useRequired(element as IFormElement, context as object),
      {
        initialProps: [mockElement, mockContext],
      },
    );

    expect(checkIfRequired).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(true);

    // Rerender with same props
    rerender([mockElement, mockContext]);
    expect(checkIfRequired).toHaveBeenCalledTimes(1);

    // Rerender with different element
    rerender([{ ...mockElement, validate: [] }, mockContext]);
    expect(checkIfRequired).toHaveBeenCalledTimes(2);

    // Rerender with different context
    rerender([mockElement, { ...mockContext, newValue: true }] as any);
    expect(checkIfRequired).toHaveBeenCalledTimes(3);
  });
});
