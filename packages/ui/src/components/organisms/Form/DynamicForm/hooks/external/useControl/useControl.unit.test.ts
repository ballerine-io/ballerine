import {
  IRuleExecutionResult,
  useRuleEngine,
} from '@/components/organisms/Form/hooks/useRuleEngine';
import { useValidator } from '@/components/organisms/Form/Validator';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useEvents } from '../../internal/useEvents';
import { useRules } from '../useRules';
import { useControl } from './useControl';

vi.mock('@/components/organisms/Form/hooks/useRuleEngine');
vi.mock('@/components/organisms/Form/Validator');
vi.mock('../../../context');
vi.mock('../../internal/useEvents');
vi.mock('../useRules');

describe('useControl', () => {
  const mockElement = {
    id: 'test-id',
    element: 'test-type',
    disable: [],
    valueDestination: 'test-value-destination',
  } as IFormElement<any, any>;

  const mockStack = [0, 1];

  const mockValues = { field1: 'value1' };
  const mockMetadata = { meta1: 'value1' };
  const mockValidationParams = { validateOnBlur: true };

  const mockSendEvent = vi.fn();
  const mockValidate = vi.fn();
  const mockRules = ['rule1'];

  beforeEach(() => {
    vi.mocked(useDynamicForm).mockReturnValue({
      values: mockValues,
      metadata: mockMetadata,
      validationParams: mockValidationParams,
    } as any);

    vi.mocked(useEvents).mockReturnValue({
      sendEvent: mockSendEvent,
    } as any);

    vi.mocked(useValidator).mockReturnValue({
      validate: mockValidate,
      errors: {},
      values: mockValues,
      isValid: true,
    } as any);

    vi.mocked(useRules).mockReturnValue(mockRules);

    vi.mocked(useRuleEngine).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return disabled false when no rules match', () => {
    vi.mocked(useRuleEngine).mockReturnValue([]);

    const { result } = renderHook(() => useControl(mockElement, mockStack));

    expect(result.current.disabled).toBe(false);
  });

  it('should return disabled true when any rule matches', () => {
    vi.mocked(useRuleEngine).mockReturnValue([
      { result: true },
      { result: false },
    ] as IRuleExecutionResult[]);

    const { result } = renderHook(() => useControl(mockElement, mockStack));

    expect(result.current.disabled).toBe(true);
  });

  it('should call sendEvent with onClick when onClick is called', () => {
    const { result } = renderHook(() => useControl(mockElement, mockStack));

    result.current.onClick();

    expect(mockSendEvent).toHaveBeenCalledWith('onClick');
  });

  it('should call sendEvent with onFocus when onFocus is called', () => {
    const { result } = renderHook(() => useControl(mockElement, mockStack));

    result.current.onFocus();

    expect(mockSendEvent).toHaveBeenCalledWith('onFocus');
  });

  it('should call sendEvent and validate when onBlur is called and validateOnBlur is true', () => {
    const { result } = renderHook(() => useControl(mockElement, mockStack));

    result.current.onBlur();

    expect(mockSendEvent).toHaveBeenCalledWith('onBlur');
    expect(mockValidate).toHaveBeenCalled();
  });

  it('should not call validate when onBlur is called and validateOnBlur is false', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      values: mockValues,
      metadata: mockMetadata,
      validationParams: { validateOnBlur: false },
    } as any);

    const { result } = renderHook(() => useControl(mockElement, mockStack));

    result.current.onBlur();

    expect(mockSendEvent).toHaveBeenCalledWith('onBlur');
    expect(mockValidate).not.toHaveBeenCalled();
  });
});
