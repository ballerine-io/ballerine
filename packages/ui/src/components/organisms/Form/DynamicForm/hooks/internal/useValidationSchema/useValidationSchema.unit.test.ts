import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { convertFormElementsToValidationSchema } from '../../../helpers/convert-form-emenents-to-validation-schema';
import { IFormElement } from '../../../types';
import { useValidationSchema } from './useValidationSchema';

vi.mock('../../../helpers/convert-form-emenents-to-validation-schema', () => ({
  convertFormElementsToValidationSchema: vi.fn(),
}));

describe('useValidationSchema', () => {
  const mockElements: IFormElement[] = [
    {
      id: '1',
      valueDestination: 'test',
      element: 'textinput',
      validate: [],
    },
  ];

  const mockValidationSchema = [
    {
      id: '1',
      valueDestination: 'test',
      validators: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(convertFormElementsToValidationSchema).mockReturnValue(mockValidationSchema);
  });

  test('should return validation schema', () => {
    const { result } = renderHook(() => useValidationSchema(mockElements));

    expect(convertFormElementsToValidationSchema).toHaveBeenCalledWith(mockElements);
    expect(result.current).toEqual(mockValidationSchema);
  });

  test('should memoize validation schema', () => {
    const { result, rerender } = renderHook(props => useValidationSchema(props), {
      initialProps: mockElements,
    });

    const firstResult = result.current;

    // Rerender with same props
    rerender(mockElements);
    expect(result.current).toBe(firstResult);
    expect(convertFormElementsToValidationSchema).toHaveBeenCalledTimes(1);
  });

  test('should recalculate when elements change', () => {
    const { result, rerender } = renderHook(props => useValidationSchema(props), {
      initialProps: mockElements,
    });

    const firstResult = result.current;

    const newElements = [
      {
        id: '2',
        valueDestination: 'test2',
        element: 'textinput',
        validate: [],
      },
    ] as IFormElement[];

    const newValidationSchema = [
      {
        id: '2',
        valueDestination: 'test2',
        validators: [],
      },
    ];

    vi.mocked(convertFormElementsToValidationSchema).mockReturnValue(newValidationSchema);

    // Rerender with different props
    rerender(newElements);

    expect(result.current).not.toBe(firstResult);
    expect(result.current).toEqual(newValidationSchema);
    expect(convertFormElementsToValidationSchema).toHaveBeenCalledTimes(2);
  });
});
