import { IRuleExecutionResult, useRuleEngine } from '@/components/organisms/Form/hooks';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useValidator } from '../../../../Validator';
import { IDynamicFormContext, useDynamicForm } from '../../../context';
import { ICommonFieldParams, IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { IFormEventElement } from '../../internal/useEvents/types';
import { usePriorityFields } from '../../internal/usePriorityFields';
import { useElementId } from '../useElementId';
import { useRules } from '../useRules';
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

vi.mock('../useRules', () => ({
  useRules: vi.fn(),
}));

vi.mock('../../internal/useEvents', () => ({
  useEvents: vi.fn(),
}));

vi.mock('../../internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

vi.mock('../../../../Validator', () => ({
  useValidator: vi.fn(),
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
  const mockValidate = vi.fn();

  const mockFieldHelpers = {
    setValue: mockSetValue,
    getValue: mockGetValue,
    setTouched: mockSetTouched,
    getTouched: mockGetTouched,
  };

  const mockMetadata = {
    someMetadata: 'test',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useElementId).mockReturnValue('test-field-1-2');
    vi.mocked(useValueDestination).mockReturnValue('test.path[1][2]');
    vi.mocked(useRuleEngine).mockReturnValue([]);
    vi.mocked(useRules).mockImplementation(rules => rules ?? []);
    vi.mocked(useEvents).mockReturnValue({
      sendEvent: mockSendEvent,
      sendEventAsync: mockSendEventAsync,
    } as unknown as ReturnType<typeof useEvents>);
    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      values: {},
      metadata: mockMetadata,
      validationParams: {
        validateOnBlur: true,
      },
    } as unknown as IDynamicFormContext<object>);
    vi.mocked(useValidator).mockReturnValue({
      validate: mockValidate,
    } as any);
    vi.mocked(usePriorityFields).mockReturnValue({
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
      priorityField: undefined,
    });
    mockGetValue.mockReturnValue('test-value');
    mockGetTouched.mockReturnValue(false);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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
      expect(mockSendEventAsync).toHaveBeenCalledWith('onChange');
    });

    it('should not trigger async event when ignoreEvent is true', () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      result.current.onChange('new-value', true);

      vi.advanceTimersByTime(550);

      expect(mockSendEventAsync).not.toHaveBeenCalled();
    });

    it('should use sendEvent instead of sendEventAsync when syncEvents is true', () => {
      const elementWithSyncEvents = {
        ...mockElement,
        params: { syncEvents: true },
      };

      const { result } = renderHook(() => useField(elementWithSyncEvents, mockStack));

      result.current.onChange('new-value');

      expect(mockSetValue).toHaveBeenCalledWith('test-field-1-2', 'test.path[1][2]', 'new-value');
      expect(mockSendEvent).toHaveBeenCalledWith('onChange');
      expect(mockSendEventAsync).not.toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {
    it('should trigger blur event and validate when validateOnBlur is true', async () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      await result.current.onBlur();

      expect(mockSendEvent).toHaveBeenCalledWith('onBlur');
      expect(mockValidate).toHaveBeenCalled();
    });

    it('should not validate when validateOnBlur is false', async () => {
      vi.mocked(useDynamicForm).mockReturnValue({
        fieldHelpers: mockFieldHelpers,
        values: {},
        metadata: mockMetadata,
        validationParams: {
          validateOnBlur: false,
        },
      } as unknown as IDynamicFormContext<object>);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      await result.current.onBlur();

      expect(mockSendEvent).toHaveBeenCalledWith('onBlur');
      expect(mockValidate).not.toHaveBeenCalled();
    });

    it('should set touched state after validation delay', async () => {
      vi.mocked(useDynamicForm).mockReturnValue({
        fieldHelpers: mockFieldHelpers,
        values: {},
        metadata: mockMetadata,
        validationParams: {
          validateOnBlur: true,
          validationDelay: 100,
        },
      } as unknown as IDynamicFormContext<object>);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(mockSetTouched).not.toHaveBeenCalled();

      await result.current.onBlur();

      vi.advanceTimersByTime(120);

      expect(mockSetTouched).toHaveBeenCalledWith('test-field-1-2', true);
    });
  });

  describe('onFocus', () => {
    it('should trigger focus event', () => {
      const { result } = renderHook(() => useField(mockElement, mockStack));

      result.current.onFocus();

      expect(mockSendEvent).toHaveBeenCalledWith('onFocus');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when any rule returns true', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: true, rule: {} } as IRuleExecutionResult,
        { result: false, rule: {} } as IRuleExecutionResult,
      ]);

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(true);
    });

    it('should not be disabled when all rules return false', () => {
      vi.mocked(useRuleEngine).mockReturnValue([
        { result: false, rule: {} } as IRuleExecutionResult,
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

    it('should be disabled when priority field should be disabled', () => {
      vi.mocked(usePriorityFields).mockReturnValue({
        isPriorityField: true,
        isShouldDisablePriorityField: true,
        isShouldHidePriorityField: false,
        priorityField: undefined,
      });

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(true);
    });

    it('should not be disabled when priority field should not be disabled', () => {
      vi.mocked(usePriorityFields).mockReturnValue({
        isPriorityField: true,
        isShouldDisablePriorityField: false,
        isShouldHidePriorityField: false,
        priorityField: undefined,
      });

      const { result } = renderHook(() => useField(mockElement, mockStack));

      expect(result.current.disabled).toBe(false);
    });

    it('should pass correct params to useRuleEngine', () => {
      renderHook(() => useField(mockElement, mockStack));

      expect(useRuleEngine).toHaveBeenCalledWith(
        { someMetadata: 'test' },
        {
          rules: mockElement.disable,
          runOnInitialize: true,
          executionDelay: 100,
        },
      );
    });

    it('should pass combined values and metadata to useRuleEngine', () => {
      vi.mocked(useDynamicForm).mockReturnValue({
        fieldHelpers: mockFieldHelpers,
        values: { someValue: 'test-value' },
        metadata: { someMetadata: 'test-metadata' },
        validationParams: {
          validateOnBlur: true,
        },
      } as unknown as IDynamicFormContext<object>);

      renderHook(() => useField(mockElement, mockStack));

      expect(useRuleEngine).toHaveBeenCalledWith(
        { someValue: 'test-value', someMetadata: 'test-metadata' },
        {
          rules: mockElement.disable,
          runOnInitialize: true,
          executionDelay: 100,
        },
      );
    });

    it('should call useRules with element disable rules and stack', () => {
      const element = {
        ...mockElement,
        disable: [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }],
      } as IFormElement<string, any>;

      renderHook(() => useField(element, mockStack));

      expect(useRules).toHaveBeenCalledWith(element.disable, mockStack);
    });

    it('should call useRules with undefined when no disable rules exist', () => {
      const element = {
        ...mockElement,
        disable: undefined,
      };

      renderHook(() => useField(element, mockStack));

      expect(useRules).toHaveBeenCalledWith(undefined, mockStack);
    });

    it('should use rules returned by useRules in useRuleEngine', () => {
      const mockRules = [{ engine: 'json-logic', value: { '==': [{ var: 'test' }, 1] } }];
      vi.mocked(useRules).mockReturnValue(mockRules);

      renderHook(() => useField(mockElement, mockStack));

      expect(useRuleEngine).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rules: mockRules,
        }),
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

  it('should be disabled when disabled prop is true', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      fieldHelpers: mockFieldHelpers,
      values: {},
      metadata: mockMetadata,
      validationParams: {
        validateOnBlur: true,
      },
      disabled: true,
    } as unknown as IDynamicFormContext<object>);

    const { result } = renderHook(() => useField(mockElement, mockStack));

    expect(result.current.disabled).toBe(true);
  });
});
