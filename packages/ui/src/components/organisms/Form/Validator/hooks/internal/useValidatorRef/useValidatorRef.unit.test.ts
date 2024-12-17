import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IValidatorContext } from '../../../context';
import { useValidator } from '../../external/useValidator/useValidator';
import { useValidatorRef } from './useValidatorRef';

const mockValidate = vi.fn();

vi.mock('../../external/useValidator/useValidator', () => ({
  useValidator: vi.fn(() => ({
    validate: mockValidate,
  })),
}));

describe('useValidatorRef', () => {
  const mockRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useValidator).mockReturnValue({
      validate: mockValidate,
    } as unknown as IValidatorContext<any>);
  });

  it('should return context from useValidator', () => {
    const { result } = renderHook(() => useValidatorRef());

    expect(result.current).toEqual({
      validate: mockValidate,
    });
    expect(useValidator).toHaveBeenCalled();
  });

  it('should set ref.current.validate to context.validate when ref is provided', () => {
    renderHook(() => useValidatorRef(mockRef));

    expect(mockRef.current).toEqual({
      validate: mockValidate,
    });
  });

  it('should not set ref when no ref object is provided', () => {
    const { result } = renderHook(() => useValidatorRef());

    expect(result.current).toEqual({
      validate: mockValidate,
    });
  });
});
