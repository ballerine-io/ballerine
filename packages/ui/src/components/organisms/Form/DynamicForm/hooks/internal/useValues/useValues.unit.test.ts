import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useValues } from './useValues';

describe('useValues', () => {
  const initialValues = {
    name: 'John',
    address: {
      street: 'Main St',
    },
  };

  it('should initialize with provided values', () => {
    const { result } = renderHook(() => useValues({ values: initialValues, onChange: vi.fn() }));

    expect(result.current.values).toEqual(initialValues);
  });

  it('should update values and call onChange when setValues is called', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useValues({
        values: initialValues,
        onChange,
      }),
    );

    const newValues = { name: 'Jane', address: { street: 'Second St' } };

    act(() => {
      result.current.setValues(newValues);
    });

    expect(result.current.values).toEqual(newValues);
    expect(onChange).toHaveBeenCalledWith(newValues);
  });

  it('should update field value and call onChange and onFieldChange when setFieldValue is called', () => {
    const onChange = vi.fn();
    const onFieldChange = vi.fn();
    const { result } = renderHook(() =>
      useValues({
        values: initialValues,
        onChange,
        onFieldChange,
      }),
    );

    act(() => {
      result.current.setFieldValue('name', 'name', 'Jane');
    });

    const expectedValues = {
      ...initialValues,
      name: 'Jane',
    };

    expect(result.current.values).toEqual(expectedValues);
    expect(onFieldChange).toHaveBeenCalledWith('name', 'Jane', expectedValues);
    expect(onChange).toHaveBeenCalledWith(expectedValues);
  });

  it('should update nested field value correctly', () => {
    const { result } = renderHook(() =>
      useValues({
        values: initialValues,
      }),
    );

    act(() => {
      result.current.setFieldValue('street', 'address.street', 'Second St');
    });

    expect(result.current.values).toEqual({
      ...initialValues,
      address: {
        street: 'Second St',
      },
    });
  });

  it('should work without optional callbacks', () => {
    const { result } = renderHook(() =>
      useValues({
        values: initialValues,
      }),
    );

    act(() => {
      result.current.setValues({ name: 'Jane', address: { street: 'Second St' } });
    });

    expect(result.current.values).toEqual({ name: 'Jane', address: { street: 'Second St' } });

    act(() => {
      result.current.setFieldValue('name', 'name', 'John');
    });

    expect(result.current.values).toEqual({ name: 'John', address: { street: 'Second St' } });
  });
});
