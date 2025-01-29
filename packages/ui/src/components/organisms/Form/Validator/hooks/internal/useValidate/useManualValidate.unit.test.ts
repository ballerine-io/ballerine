import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validate } from '../../../utils/validate';
import { useManualValidate } from './useManualValidate';

vi.mock('../../../utils/validate', () => ({
  validate: vi.fn(),
}));

describe('useManualValidate', () => {
  const mockContext = { name: 'John' };
  const mockSchema = [{ id: 'name', validators: [], rules: [] }];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty validation errors', () => {
    const { result } = renderHook(() => useManualValidate(mockContext, mockSchema));
    const [validationErrors, validate] = result.current;

    expect(validationErrors).toEqual([]);
    expect(validate).toBeInstanceOf(Function);
  });

  it('should validate and set errors when validate is called', () => {
    const { result } = renderHook(() => useManualValidate(mockContext, mockSchema));

    vi.mocked(validate).mockReturnValue([
      {
        id: 'name',
        originId: 'name',
        message: ['error'],
        invalidValue: 'John',
      },
    ]);

    act(() => {
      result.current[1]();
    });

    expect(vi.mocked(validate)).toHaveBeenCalledWith(mockContext, mockSchema, {
      abortEarly: false,
    });
    expect(result.current[0]).toEqual([
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
      result.current[1]();
    });

    expect(vi.mocked(validate)).toHaveBeenCalledWith(mockContext, mockSchema, {
      abortEarly: true,
    });
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

    const [_, validate] = result.current;

    const firstValidate = validate;

    // Rerender with same props
    rerender({
      context: mockContext,
      schema: mockSchema,
      params: { abortEarly: false },
    });

    expect(validate).toBe(firstValidate);

    // Rerender with different context
    rerender({
      context: { ...mockContext, newField: 'value' } as any,
      schema: mockSchema,
      params: { abortEarly: false },
    });

    expect(result.current[1]).not.toBe(firstValidate);
  });
});
