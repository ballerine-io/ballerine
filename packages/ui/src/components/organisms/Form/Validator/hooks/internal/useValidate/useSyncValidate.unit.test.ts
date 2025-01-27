import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validate } from '../../../utils/validate';
import { useSyncValidate } from './useSyncValidate';

// Mock dependencies
vi.mock('../../../utils/validate');

describe('useSyncValidate', () => {
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
  });

  it('should initialize with empty validation errors when validateSync is false', () => {
    const { result } = renderHook(() =>
      useSyncValidate(mockContext, mockSchema, { validateSync: false }),
    );
    expect(result.current).toEqual([]);
    expect(validate).not.toHaveBeenCalled();
  });

  it('should initialize with empty validation errors when validateOnChange is false', () => {
    const { result } = renderHook(() =>
      useSyncValidate(mockContext, mockSchema, { validateOnChange: false }),
    );
    expect(result.current).toEqual([]);
    expect(validate).not.toHaveBeenCalled();
  });

  it('should validate and return errors when validateSync and validateOnChange are true', () => {
    const { result } = renderHook(() =>
      useSyncValidate(mockContext, mockSchema, {
        validateSync: true,
        validateOnChange: true,
      }),
    );

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
      useSyncValidate(mockContext, mockSchema, {
        validateSync: true,
        validateOnChange: true,
        abortEarly: true,
      }),
    );

    expect(validate).toHaveBeenCalledWith(mockContext, mockSchema, { abortEarly: true });
  });

  it('should revalidate when context changes', () => {
    const { rerender } = renderHook(
      ({ context }) =>
        useSyncValidate(context, mockSchema, {
          validateSync: true,
          validateOnChange: true,
        }),
      {
        initialProps: { context: mockContext },
      },
    );

    const newContext = { name: 'Jane' };
    rerender({ context: newContext });

    expect(validate).toHaveBeenCalledWith(newContext, mockSchema, { abortEarly: false });
  });

  it('should revalidate when schema changes', () => {
    const { rerender } = renderHook(
      ({ schema }) =>
        useSyncValidate(mockContext, schema, {
          validateSync: true,
          validateOnChange: true,
        }),
      {
        initialProps: { schema: mockSchema },
      },
    );

    const newSchema = [{ id: 'email', validators: [], rules: [] }];
    rerender({ schema: newSchema });

    expect(validate).toHaveBeenCalledWith(mockContext, newSchema, { abortEarly: false });
  });
});
