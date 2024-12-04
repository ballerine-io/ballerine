import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validate } from '../../../utils/validate';
import { useManualValidate } from './useManualValidate';

vi.mock('../../../utils/validate', () => ({
  validate: vi.fn().mockReturnValue([
    {
      id: 'name',
      originId: 'name',
      message: ['error'],
      invalidValue: 'John',
    },
  ]),
}));

describe('useManualValidate', () => {
  const mockContext = { name: 'John' };
  const mockSchema = [{ id: 'name', validators: [], rules: [] }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty validation errors', () => {
    const { result } = renderHook(() => useManualValidate(mockContext, mockSchema));

    expect(result.current.validationErrors).toEqual([]);
  });

  it('should validate and set errors when validate is called', () => {
    const { result } = renderHook(() => useManualValidate(mockContext, mockSchema));

    act(() => {
      result.current.validate();
    });

    expect(validate).toHaveBeenCalledWith(mockContext, mockSchema, { abortEarly: false });
    expect(result.current.validationErrors).toEqual([
      {
        id: 'name',
        originId: 'name',
        message: ['error'],
        invalidValue: 'John',
      },
    ]);
  });

  it('should pass abortEarly param to validate function', () => {
    const { result } = renderHook(() =>
      useManualValidate(mockContext, mockSchema, { abortEarly: true }),
    );

    act(() => {
      result.current.validate();
    });

    expect(validate).toHaveBeenCalledWith(mockContext, mockSchema, { abortEarly: true });
  });

  it('should memoize validate callback with correct dependencies', () => {
    const { result, rerender } = renderHook(
      ({ context, schema, params }) => useManualValidate(context, schema, params),
      {
        initialProps: {
          context: mockContext,
          schema: mockSchema,
          params: { abortEarly: false },
        },
      },
    );

    const firstValidate = result.current.validate;

    // Rerender with same props
    rerender({
      context: mockContext,
      schema: mockSchema,
      params: { abortEarly: false },
    });

    expect(result.current.validate).toBe(firstValidate);

    // Rerender with different context
    rerender({
      context: { ...mockContext, newField: 'value' } as any,
      schema: mockSchema,
      params: { abortEarly: false },
    });

    expect(result.current.validate).not.toBe(firstValidate);
  });
});
