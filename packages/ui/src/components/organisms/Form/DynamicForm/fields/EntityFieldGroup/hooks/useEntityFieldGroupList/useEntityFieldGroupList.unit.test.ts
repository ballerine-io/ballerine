import { useHttp } from '@/common/hooks/useHttp';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../../../hooks/external';
import { useStack } from '../../../FieldList';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';
import { useEntityFieldGroupList } from './useEntityFieldGroupList';

vi.mock('../../../../hooks/external', () => ({
  useField: vi.fn(),
}));

vi.mock('../../../FieldList', () => ({
  useStack: vi.fn(),
}));

vi.mock('@/common/hooks/useHttp', () => ({
  useHttp: vi.fn(),
}));

describe('useEntityFieldGroupList', () => {
  const mockElement = {
    id: 'test',
    element: 'entityFieldGroup',
    valueDestination: 'test',
    params: {
      httpParams: {
        deleteEntity: {
          url: 'http://test.com',
        },
      },
      type: 'entityFieldGroup',
    } as unknown as IEntityFieldGroupParams,
  };

  const mockStack: TDeepthLevelStack = [];

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue({
      onChange: vi.fn(),
      value: [],
    } as unknown as ReturnType<typeof useField>);
    vi.mocked(useHttp).mockReturnValue({
      run: vi.fn(),
      isLoading: false,
    } as unknown as ReturnType<typeof useHttp>);

    Object.defineProperty(window, 'crypto', {
      value: {
        randomUUID: vi.fn(),
      },
    });
  });

  it('should initialize with empty array if no value provided', () => {
    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));
    expect(result.current.items).toEqual([]);
  });

  it('should add new item with generated __id', async () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      onChange: mockOnChange,
      value: [],
    } as unknown as ReturnType<typeof useField>);

    const mockUUID = '123-456';
    vi.mocked(window.crypto.randomUUID).mockReturnValue(
      mockUUID as `${string}-${string}-${string}-${string}-${string}`,
    );

    const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

    await result.current.addItem();

    expect(mockOnChange).toHaveBeenCalledWith([{ __id: mockUUID }]);
  });

  describe('when entity is not created', () => {
    it('should remove item by id', async () => {
      const mockOnChange = vi.fn();
      const mockEntities = [
        { __id: '1', name: 'Entity 1' },
        { __id: '2', name: 'Entity 2' },
      ];

      vi.mocked(useField).mockReturnValue({
        onChange: mockOnChange,
        value: mockEntities,
      } as unknown as ReturnType<typeof useField>);

      const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

      await result.current.removeItem('1');

      expect(mockOnChange).toHaveBeenCalledWith([{ __id: '2', name: 'Entity 2' }]);
    });

    it('should not remove item if value is not an array', async () => {
      const mockOnChange = vi.fn();
      vi.mocked(useField).mockReturnValue({
        onChange: mockOnChange,
        value: undefined as any,
      } as unknown as ReturnType<typeof useField>);

      const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

      await result.current.removeItem('1');

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('when entity is created', () => {
    it('should remove item by id', async () => {
      const deleteEntitySpy = vi.fn();

      vi.mocked(useHttp).mockReturnValue({
        run: deleteEntitySpy,
        isLoading: false,
      } as unknown as ReturnType<typeof useHttp>);

      const mockOnChange = vi.fn();
      const mockEntities = [
        { __id: '1', ballerineEntityId: '1', name: 'Entity 1' },
        { __id: '2', ballerineEntityId: '2', name: 'Entity 2' },
      ];

      vi.mocked(useField).mockReturnValue({
        onChange: mockOnChange,
        value: mockEntities,
      } as unknown as ReturnType<typeof useField>);

      const { result } = renderHook(() => useEntityFieldGroupList({ element: mockElement }));

      await result.current.removeItem('1');

      expect(deleteEntitySpy).toHaveBeenCalledWith({}, { params: { entityId: '1' } });

      expect(mockOnChange).toHaveBeenCalledWith([
        { ballerineEntityId: '2', __id: '2', name: 'Entity 2' },
      ]);
    });
  });
});
