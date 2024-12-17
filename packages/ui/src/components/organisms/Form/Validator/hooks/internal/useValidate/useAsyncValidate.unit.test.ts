import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validate } from '../../../utils/validate';
import { useAsyncValidate } from './useAsyncValidate';

// Mock dependencies
vi.mock('../../../utils/validate');

describe('useAsyncValidate', () => {
  const mockContext = { name: 'John' };
  const mockSchema = [{ id: 'name', validators: [], rules: [] }];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(validate).mockReturnValue([
      {
        id: 'name',
        originId: 'name',
        message: ['error'],
        invalidValue: 'John',
      },
    ]);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty validation errors', () => {
    const { result } = renderHook(() => useAsyncValidate(mockContext, mockSchema));
    expect(result.current).toEqual([]);
  });

  it('should not validate when validateAsync is false', () => {
    renderHook(() => useAsyncValidate(mockContext, mockSchema, { validateAsync: false }));
    expect(validate).not.toHaveBeenCalled();
  });

  it('should not validate when validateOnChange is false', () => {
    renderHook(() => useAsyncValidate(mockContext, mockSchema, { validateOnChange: false }));
    expect(validate).not.toHaveBeenCalled();
  });

  it('should validate and set errors when validateAsync and validateOnChange are true', () => {
    const { result } = renderHook(() =>
      useAsyncValidate(mockContext, mockSchema, {
        validateAsync: true,
        validateOnChange: true,
      }),
    );

    vi.advanceTimersByTime(500);

    expect(validate).toHaveBeenCalledWith(mockContext, mockSchema, { abortEarly: false });
    expect(result.current).toEqual([
      {
        id: 'name',
        originId: 'name',
        message: ['error'],
        invalidValue: 'John',
      },
    ]);
  });

  it('should pass abortEarly param to validate function', () => {
    renderHook(() =>
      useAsyncValidate(mockContext, mockSchema, {
        validateAsync: true,
        validateOnChange: true,
        abortEarly: true,
      }),
    );

    vi.advanceTimersByTime(500);

    expect(validate).toHaveBeenCalledWith(mockContext, mockSchema, { abortEarly: true });
  });

  it('should revalidate when context changes', () => {
    const { rerender } = renderHook(
      ({ context }) =>
        useAsyncValidate(context, mockSchema, {
          validateAsync: true,
          validateOnChange: true,
        }),
      {
        initialProps: { context: mockContext },
      },
    );

    const newContext = { name: 'Jane' };
    rerender({ context: newContext });

    vi.advanceTimersByTime(500);

    expect(validate).toHaveBeenCalledWith(newContext, mockSchema, { abortEarly: false });
  });

  it('should revalidate when schema changes', () => {
    const { rerender } = renderHook(
      ({ schema }) =>
        useAsyncValidate(mockContext, schema, {
          validateAsync: true,
          validateOnChange: true,
        }),
      {
        initialProps: { schema: mockSchema },
      },
    );

    const newSchema = [{ id: 'email', validators: [], rules: [] }];
    rerender({ schema: newSchema });

    vi.advanceTimersByTime(500);

    expect(validate).toHaveBeenCalledWith(mockContext, newSchema, { abortEarly: false });
  });
});
