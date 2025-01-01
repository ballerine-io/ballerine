import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClearValueOnHide } from './useClearValueOnHide';

vi.mock('@/components/organisms/DynamicUI/StateManager/components/StateProvider');
vi.mock('@/components/organisms/UIRenderer/hooks/useUIElementProps');

describe('useClearValueOnHide', () => {
  const mockSetContext = vi.fn();
  const mockPayload = {
    someField: 'value',
    arrayField: [
      { id: '1', value: 'test1' },
      { id: '2', value: 'test2' },
    ],
    items: [{ value: 'item1' }, { value: 'item2' }, { value: 'item3' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useStateManagerContext).mockReturnValue({
      payload: mockPayload,
      stateApi: {
        setContext: mockSetContext,
      },
    } as any);
  });

  it('should not clear value if clearValueOnHide is not defined', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      type: 'string',
      options: {},
    };

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it('should clear value by id when element is hidden', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      type: 'string',
      options: {},
      clearValueOnHide: {
        byId: '1',
        valueDestination: 'arrayField',
      },
    };

    const { rerender } = renderHook(() => useClearValueOnHide(definition, null));
    rerender();

    expect(mockSetContext).toHaveBeenLastCalledWith({
      ...mockPayload,
      arrayField: [{ id: '2', value: 'test2' }],
    });
  });

  it('should clear value by destination when element is hidden', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      type: 'string',
      options: {},
      clearValueOnHide: {
        valueDestination: 'someField',
      },
    };

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockSetContext).toHaveBeenCalledWith({
      ...mockPayload,
      someField: undefined,
    });
  });

  it('should not clear value when element is visible', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: false } as any);

    const definition = {
      name: 'test',
      type: 'string',
      options: {},
      clearValueOnHide: {
        valueDestination: 'someField',
      },
    };

    renderHook(() => useClearValueOnHide(definition, null));

    expect(mockSetContext).not.toHaveBeenCalled();
  });

  it('should handle array index in destination path', () => {
    vi.mocked(useUIElementProps).mockReturnValue({ hidden: true } as any);

    const definition = {
      name: 'test',
      type: 'string',
      options: {},
      clearValueOnHide: {
        valueDestination: 'items[1].value',
      },
    };

    const { rerender } = renderHook(() => useClearValueOnHide(definition, 1));
    rerender();

    expect(mockSetContext).toHaveBeenCalledWith({
      ...mockPayload,
      items: [{ value: 'item1' }, { value: undefined }, { value: 'item3' }],
    });
  });
});
