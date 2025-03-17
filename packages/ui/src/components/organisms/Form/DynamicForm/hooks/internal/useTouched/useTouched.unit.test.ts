import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../../types';
import { generateTouchedMapForAllElements } from './helpers/generate-touched-map-for-all-elements/generate-touched-map-for-all-elements';
import { useTouched } from './useTouched';

vi.mock(
  './helpers/generate-touched-map-for-all-elements/generate-touched-map-for-all-elements',
  () => ({
    generateTouchedMapForAllElements: vi.fn(),
  }),
);

vi.mock('../../../helpers/get-field-definitions-from-schema', () => ({
  getFieldDefinitionsFromSchema: vi.fn(elements => elements),
}));

describe('useTouched', () => {
  const elements: IFormElement[] = [
    { id: '1', valueDestination: '1', children: [], validate: [], element: 'textinput' },
    { id: '2', valueDestination: '2', children: [], validate: [], element: 'textinput' },
  ];
  const context = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty touched state', () => {
    const { result } = renderHook(() => useTouched(elements, context));

    expect(result.current.touched).toEqual({});
  });

  it('should set field touched state', () => {
    const { result } = renderHook(() => useTouched(elements, context));

    act(() => {
      result.current.setFieldTouched('field1', true);
    });

    expect(result.current.touched).toEqual({ field1: true });

    act(() => {
      result.current.setFieldTouched('field2', false);
    });

    expect(result.current.touched).toEqual({ field1: true, field2: false });
  });

  it('should set touched state', () => {
    const { result } = renderHook(() => useTouched(elements, context));
    const newTouchedState = { field1: true, field2: false };

    act(() => {
      result.current.setTouched(newTouchedState);
    });

    expect(result.current.touched).toEqual(newTouchedState);
  });

  it('should touch all fields', () => {
    const mockTouchedMap = { '1': true, '2': true };
    vi.mocked(generateTouchedMapForAllElements).mockReturnValue(mockTouchedMap);

    const { result } = renderHook(() => useTouched(elements, context));

    act(() => {
      result.current.touchAllFields();
    });

    expect(generateTouchedMapForAllElements).toHaveBeenCalledWith(elements, context);
    expect(result.current.touched).toEqual(mockTouchedMap);
  });

  it('should update touched state when elements or context change', () => {
    const mockTouchedMap1 = { '1': true };
    const mockTouchedMap2 = { '1': true, '2': true };

    vi.mocked(generateTouchedMapForAllElements)
      .mockReturnValueOnce(mockTouchedMap1)
      .mockReturnValueOnce(mockTouchedMap2);

    const { result, rerender } = renderHook(
      ({ elements, context }) => useTouched(elements, context),
      {
        initialProps: { elements, context },
      },
    );

    act(() => {
      result.current.touchAllFields();
    });

    expect(result.current.touched).toEqual(mockTouchedMap1);

    const newElements: IFormElement[] = [
      ...elements,
      { id: '3', valueDestination: '3', children: [], validate: [], element: 'textinput' },
    ];

    rerender({ elements: newElements, context });

    act(() => {
      result.current.touchAllFields();
    });

    expect(generateTouchedMapForAllElements).toHaveBeenCalledTimes(2);
    expect(result.current.touched).toEqual(mockTouchedMap2);
  });
});
