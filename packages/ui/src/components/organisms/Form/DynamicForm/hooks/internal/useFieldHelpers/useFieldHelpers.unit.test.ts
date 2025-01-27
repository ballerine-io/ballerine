import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTouched } from '../useTouched';
import { useValues } from '../useValues';
import { useFieldHelpers } from './useFieldHelpers';

vi.mock('../useTouched', () => ({
  useTouched: vi.fn(),
}));

vi.mock('../useValues', () => ({
  useValues: vi.fn(),
}));

describe('useFieldHelpers', () => {
  const mockSetFieldValue = vi.fn();
  const mockSetFieldTouched = vi.fn();
  const mockTouchAllFields = vi.fn();
  const mockSetValues = vi.fn();

  const mockValuesApi = {
    values: {
      field1: 'value1',
      field2: 'value2',
      nestedValue: {
        nestedField1: 'nestedValue1',
      },
    },
    setFieldValue: mockSetFieldValue,
    setValues: mockSetValues,
  };

  const mockTouchedApi = {
    touched: {
      field1: true,
      field2: false,
    },
    setFieldTouched: mockSetFieldTouched,
    touchAllFields: mockTouchAllFields,
  };

  const setup = () => {
    return renderHook(() =>
      useFieldHelpers({
        valuesApi: mockValuesApi as unknown as ReturnType<typeof useValues>,
        touchedApi: mockTouchedApi as unknown as ReturnType<typeof useTouched>,
      }),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return helper functions', () => {
    const { result } = setup();

    expect(result.current).toHaveProperty('getTouched');
    expect(result.current).toHaveProperty('getValue');
    expect(result.current).toHaveProperty('setTouched');
    expect(result.current).toHaveProperty('setValue');
    expect(result.current).toHaveProperty('setValues');
    expect(result.current).toHaveProperty('touchAllFields');
  });

  it('getTouched should return correct touched state', () => {
    const { result } = setup();

    expect(result.current.getTouched('field1')).toBe(true);
    expect(result.current.getTouched('field2')).toBe(false);
  });

  it('getValue should return correct value', () => {
    const { result } = setup();

    expect(result.current.getValue<string>('field1')).toBe('value1');
    expect(result.current.getValue<string>('field2')).toBe('value2');
  });

  it('getValue should return correct nested value', () => {
    const { result } = setup();

    expect(result.current.getValue<string>('nestedValue.nestedField1')).toBe('nestedValue1');
  });

  it('setTouched should call touchedApi.setFieldTouched', () => {
    const { result } = setup();

    result.current.setTouched('field1', true);

    expect(mockSetFieldTouched).toHaveBeenCalledTimes(1);
    expect(mockSetFieldTouched).toHaveBeenCalledWith('field1', true);
  });

  it('setValue should call valuesApi.setFieldValue', () => {
    const { result } = setup();

    result.current.setValue('field1', 'path.to.field', 'newValue');

    expect(mockSetFieldValue).toHaveBeenCalledTimes(1);
    expect(mockSetFieldValue).toHaveBeenCalledWith('field1', 'path.to.field', 'newValue');
  });

  it('setValues should call valuesApi.setValues', () => {
    const { result } = setup();

    const newValues = { field1: 'new1', field2: 'new2' };
    result.current.setValues(newValues);

    expect(mockSetValues).toHaveBeenCalledTimes(1);
    expect(mockSetValues).toHaveBeenCalledWith(newValues);
  });

  it('touchAllFields should call touchedApi.touchAllFields', () => {
    const { result } = setup();

    result.current.touchAllFields();

    expect(mockTouchAllFields).toHaveBeenCalledTimes(1);
  });

  it('should memoize helper functions', () => {
    const { result, rerender } = setup();

    const firstHelpers = result.current;

    rerender();

    expect(result.current).toBe(firstHelpers);
  });
});
