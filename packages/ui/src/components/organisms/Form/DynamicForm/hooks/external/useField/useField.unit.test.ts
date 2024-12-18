import { IRuleExecutionResult, useRuleEngine } from '@/components/organisms/Form/hooks';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDynamicFormContext, useDynamicForm } from '../../../context';
import { ICommonFieldParams, IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { IFormEventElement } from '../../internal/useEvents/types';
import { useElementId } from '../useElementId';
import { useValueDestination } from '../useValueDestination';
import { useField } from './useField';

vi.mock('@/components/organisms/Form/hooks', () => ({
  useRuleEngine: vi.fn(),
}));

vi.mock('../../../context', () => ({
  useDynamicForm: vi.fn(),
}));

vi.mock('../useElementId', () => ({
  useElementId: vi.fn(),
}));

vi.mock('../useValueDestination', () => ({
  useValueDestination: vi.fn(),
}));

vi.mock('../../internal/useEvents', () => ({
  useEvents: vi.fn(),
}));

describe('useField', () => {
  const mockElement = {
    id: 'test-field',
    valueDestination: 'test.path',
    disable: [],
    element: {} as IFormEventElement<string>,
  } as unknown as IFormElement<string, ICommonFieldParams>;

  const mockStack = [1, 2];

  const mockSetValue = vi.fn();
  const mockGetValue = vi.fn();
  const mockSetTouched = vi.fn();
  const mockGetTouched = vi.fn();
  const mockSendEvent = vi.fn();
  const mockSendEventAsync = vi.fn();

  const mockFieldHelpers = {
    setValue: mockSetValue,
    getValue: mockGetValue,
    setTouched: mockSetTouched,
    getTouched: mockGetTouched,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useElementId).mockReturnValue('test-field-1-2');
    vi.mocked(useValueDestination).mockReturnValue('test.path[1][2]');
    vi.mocked(useRuleEngine).mockReturnValue([]);
    vi.mocked(useEvents).mockReturnValue({
      sendEvent: mockSendEvent,
      sendEventAsync: mockSendEventAsync,
    } as unknown as ReturnType<typeof useEvents>);
    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      values: {},
    } as unknown as IDynamicFormContext<object>);
    mockGetValue.mockReturnValue('test-value');
    mockGetTouched.mockReturnValue(false);
  });

  it('should return field state and handlers', () => {
    const { result } = renderHook(() => useField(mockElement, mockStack));

    expect(result.current).toEqual({
      value: 'test-value',
      touched: false,
      disabled: false,
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
      onFocus: expect.any(Function),
    });
  });

  it('should call useElementId with element and stack', () => {
    renderHook(() => useField(mockElement, mockStack));

    expect(useElementId).toHaveBeenCalledWith(mockElement, mockStack);
  });

  it('should call useValueDestination with element and stack', () => {
    renderHook(() => useField(mockElement, mockStack));

    expect(useValueDestination).toHaveBeenCalledWith(mockElement, mockStack);
  });

  it('should get value using valueDestination', () => {
    renderHook(() => useField(mockElement, mockStack));

    expect(mockGetValue).toHaveBeenCalledWith('test.path[1][2]');
  });

  it('should get touched state using fieldId', () => {
    renderHook(() => useField(mockElement, mockStack));

    expect(mockGetTouched).toHaveBeenCalledWith('test-field-1-2');
  });

  describe('onChange', () => {
    it('should update value, touched state and trigger async event', () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      result.current.onChange('new-value');

      expect(mockSetValue).toHaveBeenCalledWith('test-field-1-2', 'test.path[1][2]', 'new-value');
      expect(mockSetTouched).toHaveBeenCalledWith('test-field-1-2', true);
      expect(mockSendEventAsync).toHaveBeenCalledWith('onChange');
    });
  });

  describe('onBlur', () => {
    it('should trigger blur event', () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      result.current.onBlur();

      expect(mockSendEvent).toHaveBeenCalledWith('onBlur');
    });
  });

  describe('onFocus', () => {
    it('should trigger focus event', () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      result.current.onFocus();

      expect(mockSendEvent).toHaveBeenCalledWith('onFocus');
    });
  });

  describe('when stack is not provided', () => {
    it('should use empty array as default stack', () => {
      renderHook(() => useField(mockElement));

      expect(useElementId).toHaveBeenCalledWith(mockElement, []);
      expect(useValueDestination).toHaveBeenCalledWith(mockElement, []);
    });
  });

  describe('disabled state', () => {
    it('should be disabled when all rules return true', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} } as IRuleExecutionResult,
        { result: true, rule: {} } as IRuleExecutionResult,
      ]);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(true);
    });

    it('should not be disabled when any rule returns false', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} } as IRuleExecutionResult,
        { result: false, rule: {} } as IRuleExecutionResult,
      ]);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(false);
    });

    it('should not be disabled when no rules exist', () => {
      vi.mocked(useRuleEngine).mockReturnValue([]);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(false);
    });

    it('should pass correct params to useRuleEngine', () => {
      renderHook(() => useField(mockElement, mockStack));

      expect(useRuleEngine).toHaveBeenCalledWith(
        {},
        {
          rules: mockElement.disable,
          runOnInitialize: true,
          executionDelay: 500,
        },
      );
    });
  });

  it('should memoize value', () => {
    const { result, rerender } = renderHook(() => useField(mockElement, mockStack));
    const initialValue = result.current.value;

    rerender();

    expect(result.current.value).toBe(initialValue);
  });

  it('should memoize touched', () => {
    const { result, rerender } = renderHook(() => useField(mockElement, mockStack));
    const initialTouched = result.current.touched;

    rerender();

    expect(result.current.touched).toBe(initialTouched);
  });

  it('should memoize onChange', () => {
    const { result, rerender } = renderHook(() => useField(mockElement, mockStack));
    const initialOnChange = result.current.onChange;

    rerender();

    expect(result.current.onChange).toBe(initialOnChange);
  });

  it('should memoize onBlur', () => {
    const { result, rerender } = renderHook(() => useField(mockElement, mockStack));
    const initialOnBlur = result.current.onBlur;

    rerender();

    expect(result.current.onBlur).toBe(initialOnBlur);
  });

  it('should memoize onFocus', () => {
    const { result, rerender } = renderHook(() => useField(mockElement, mockStack));
    const initialOnFocus = result.current.onFocus;

    rerender();

    expect(result.current.onFocus).toBe(initialOnFocus);
  });
});
