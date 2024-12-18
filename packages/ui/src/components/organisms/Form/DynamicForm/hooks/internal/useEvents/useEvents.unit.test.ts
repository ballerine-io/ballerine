import { formatId } from '@/components/organisms/Form/Validator/utils/format-id';
import { formatValueDestination } from '@/components/organisms/Form/Validator/utils/format-value-destination';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStack } from '../../../fields/FieldList/providers/StackProvider';
import { useCallbacks } from '../useCallbacks';
import { IFormEventElement } from './types';
import { useEvents } from './useEvents';

vi.mock('@/components/organisms/Form/Validator/utils/format-id');
vi.mock('@/components/organisms/Form/Validator/utils/format-value-destination');
vi.mock('../../../fields/FieldList/providers/StackProvider');
vi.mock('../useCallbacks');

const mockFormatId = vi.mocked(formatId);
const mockFormatValueDestination = vi.mocked(formatValueDestination);
const mockUseStack = vi.mocked(useStack);
const mockUseCallbacks = vi.mocked(useCallbacks);

describe('useEvents', () => {
  const mockElement = {
    id: 'test-id',
    valueDestination: 'test.destination',
    element: 'textinput',
  } as IFormEventElement<any, any>;

  const mockOnEvent = vi.fn();
  const mockStack = [0, 0];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCallbacks.mockReturnValue({ onEvent: mockOnEvent });
    mockUseStack.mockReturnValue({ stack: mockStack });
    mockFormatId.mockReturnValue('formatted-id');
    mockFormatValueDestination.mockReturnValue('formatted.destination');
    mockUseCallbacks.mockReturnValue({ onEvent: mockOnEvent });
    vi.mocked(useCallbacks).mockReturnValue({ onEvent: mockOnEvent });
  });

  it('should return sendEvent and sendEventAsync functions', () => {
    const { result } = renderHook(() => useEvents(mockElement));
    expect(result.current.sendEvent).toBeInstanceOf(Function);
    expect(result.current.sendEventAsync).toBeInstanceOf(Function);
  });

  it('should call onEvent with formatted element when sendEvent is called', () => {
    const { result } = renderHook(() => useEvents(mockElement));

    result.current.sendEvent('onChange');

    expect(mockFormatId).toHaveBeenCalledWith('test-id', mockStack);
    expect(mockFormatValueDestination).toHaveBeenCalledWith('test.destination', mockStack);
    expect(mockOnEvent).toHaveBeenCalledWith('onChange', {
      ...mockElement,
      formattedId: 'formatted-id',
      formattedValueDestination: 'formatted.destination',
    });
  });

  it('should handle undefined stack', () => {
    mockUseStack.mockReturnValue({ stack: undefined });
    const { result } = renderHook(() => useEvents(mockElement));

    result.current.sendEvent('onBlur');

    expect(mockFormatId).toHaveBeenCalledWith('test-id', []);
    expect(mockFormatValueDestination).toHaveBeenCalledWith('test.destination', []);
  });

  it('should handle undefined onEvent callback', () => {
    mockUseCallbacks.mockReturnValue({ onEvent: undefined });
    const { result } = renderHook(() => useEvents(mockElement));

    expect(() => result.current.sendEvent('onFocus')).not.toThrow();
  });

  it('should use default asyncEventDelay when not provided', () => {
    const { result } = renderHook(() => useEvents(mockElement));

    vi.useFakeTimers();
    result.current.sendEventAsync('onChange');

    vi.advanceTimersByTime(500);
    expect(mockOnEvent).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should use provided asyncEventDelay', () => {
    const { result } = renderHook(() => useEvents(mockElement, { asyncEventDelay: 1000 }));

    vi.useFakeTimers();
    result.current.sendEventAsync('onChange');

    vi.advanceTimersByTime(1000);
    expect(mockOnEvent).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should debounce async events', () => {
    const { result } = renderHook(() => useEvents(mockElement));

    vi.useFakeTimers();
    result.current.sendEventAsync('onChange');
    result.current.sendEventAsync('onChange');
    result.current.sendEventAsync('onChange');

    vi.advanceTimersByTime(500);
    expect(mockOnEvent).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
