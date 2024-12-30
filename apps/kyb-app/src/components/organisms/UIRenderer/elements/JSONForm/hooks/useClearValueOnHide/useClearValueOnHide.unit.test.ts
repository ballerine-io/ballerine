import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClearValueOnHide } from './useClearValueOnHide';

vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider');
vi.mock('@/components/organisms/UIRenderer/hooks/useUIElementProps');

describe('useClearValueOnHide', () => {
  const mockSetContext = vi.fn();
  let mockPayload: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPayload = {
      testField: 'test value',
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
        getContext: () => mockPayload,
      },
    } as any);
  });

  it('should not clear value if clearValueOnHide is not defined', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      valueDestination: 'testField',
    } as unknown as UIElement<AnyObject>;

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockPayload.testField).toBe('test value');
    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it('should not clear value if element is not hidden', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: false } as any);

    const definition = {
      name: 'test',
      valueDestination: 'testField',
      clearValueOnHide: {
        valueDestination: 'testField',
      },
    } as unknown as UIElement<AnyObject>;

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockPayload.testField).toBe('test value');
    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it('should clear value when element becomes hidden', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      valueDestination: 'testField',
      clearValueOnHide: {
        valueDestination: 'testField',
      },
    } as unknown as UIElement<AnyObject>;

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockPayload.testField).toBeUndefined();
    expect(mockSetContext).toHaveBeenCalledWith(mockPayload);
  });

  it('should use valueDestination from clearValueOnHide if provided', async () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);
    mockPayload = {
      originalField: 'original value',
      testField: 'test value',
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
        getContext: () => mockPayload,
      },
    } as any);

    const definition = {
      name: 'test',
      valueDestination: 'originalField',
      clearValueOnHide: {
        valueDestination: 'testField',
      },
    } as unknown as UIElement<AnyObject>;

    const { rerender } = renderHook(() => useClearValueOnHide(definition, null));

    rerender();

    await waitFor(() => {
      expect(mockPayload.testField).toBeUndefined();
      expect(mockPayload.originalField).toBe('original value');
      expect(mockSetContext).toHaveBeenCalledWith(mockPayload);
    });
  });

  it('should handle array indices in destination path', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);
    mockPayload = {
      items: ['value1', 'value2'],
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
        getContext: () => mockPayload,
      },
    } as any);

    const definition = {
      name: 'test',
      valueDestination: 'items[{INDEX}]',
      clearValueOnHide: {
        valueDestination: 'items[{INDEX}]',
      },
    } as unknown as UIElement<AnyObject>;

    renderHook(() => useClearValueOnHide(definition, 1));

    expect(mockPayload.items[0]).toBe('value1');
    expect(mockPayload.items[1]).toBeUndefined();
    expect(mockSetContext).toHaveBeenCalledWith(mockPayload);
  });

  it('should clear value when element becomes hidden after rerender', () => {
    // Initially visible
    vi.mocked(useUIElementProps).mockReturnValueOnce({ hidden: false } as any);
    mockPayload = {
      testField: 'test value',
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
        getContext: () => mockPayload,
      },
    } as any);

    const definition = {
      name: 'test',
      valueDestination: 'testField',
      clearValueOnHide: {
        valueDestination: 'testField',
      },
    } as unknown as UIElement<AnyObject>;

    const { rerender } = renderHook(() => useClearValueOnHide(definition, null));

    // Value should remain when visible
    expect(mockPayload.testField).toBe('test value');

    // Change to hidden
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    rerender();

    // Value should be cleared after becoming hidden
    expect(mockPayload.testField).toBeUndefined();
    expect(mockSetContext).toHaveBeenCalledWith(mockPayload);
  });

  it('should not clear value when element becomes visible after rerender', () => {
    // Initially hidden
    vi.mocked(useUIElementProps).mockReturnValueOnce({ hidden: true } as any);
    mockPayload = {
      testField: undefined,
    };

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
        getContext: () => mockPayload,
      },
    } as any);

    const definition = {
      name: 'test',
      valueDestination: 'testField',
      clearValueOnHide: {
        valueDestination: 'testField',
      },
    } as unknown as UIElement<AnyObject>;

    const { rerender } = renderHook(() => useClearValueOnHide(definition, null));

    // Set a value and make visible
    mockPayload.testField = 'new value';
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: false } as any);

    rerender();

    // Value should remain when becoming visible
    expect(mockPayload.testField).toBe('new value');
  });
});
