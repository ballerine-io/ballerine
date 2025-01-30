import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../../../hooks/external';
import { useStack } from '../../../FieldList';
import { useEntityFieldGroupList } from './useEntityFieldGroupList';

vi.mock('../../../../hooks/external', () => ({
  useField: vi.fn(),
}));

vi.mock('../../../FieldList', () => ({
  useStack: vi.fn(),
}));

describe('useEntityFieldGroupList', () => {
  const mockElement = {
    id: 'test',
    element: 'entityFieldGroup',
    valueDestination: 'test',
  };

  const mockStack: TDeepthLevelStack = [];

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue({
      onChange: vi.fn(),
      value: [],
    } as unknown as ReturnType<typeof useField>);
  });

  it('should initialize with empty array if no value provided', () => {
    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));
    expect(result.current.items).toEqual([]);
  });

  it('should map entities with __id', () => {
    const mockEntities = [
      { id: '1', name: 'Entity 1' },
      { id: '2', name: 'Entity 2' },
    ];

    vi.mocked(useField).mockReturnValue({
      onChange: vi.fn(),
      value: mockEntities,
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

    expect(result.current.items).toEqual([
      { id: '1', name: 'Entity 1', __id: '1' },
      { id: '2', name: 'Entity 2', __id: '2' },
    ]);
  });

  it('should add new item with generated __id', async () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: [],
    } as unknown as ReturnType<typeof useField>);

    const mockUUID = '123-456';
    const cryptoSpy = vi.spyOn(crypto, 'randomUUID');
    cryptoSpy.mockReturnValue(mockUUID as any);

    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

    await result.current.addItem();

    expect(mockOnChange).toHaveBeenCalledWith([{ __id: mockUUID }]);
    cryptoSpy.mockRestore();
  });

  it('should remove item by id', () => {
    const mockOnChange = vi.fn();
    const mockEntities = [
      { id: '1', __id: '1', name: 'Entity 1' },
      { id: '2', __id: '2', name: 'Entity 2' },
    ];

    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: mockEntities,
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

    result.current.removeItem('1');

    expect(mockOnChange).toHaveBeenCalledWith([{ id: '2', __id: '2', name: 'Entity 2' }]);
  });

  it('should not remove item if value is not an array', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: undefined as any,
    } as unknown as ReturnType<typeof useField>);

    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

    result.current.removeItem('1');

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
