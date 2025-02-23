import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { useStack } from '../../../fields/FieldList/providers/StackProvider';
import { IFormElement } from '../../../types';
import { useElementId } from '../../external';
import { usePriorityFields } from './usePriorityFields';

vi.mock('../../../context');
vi.mock('../../../fields/FieldList/providers/StackProvider');
vi.mock('../../external');

describe('usePriorityFields', () => {
  const mockElement = { id: 'test-element' } as IFormElement<string, any>;
  const mockStack = [1, 2];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useElementId).mockReturnValue('test-id');
  });

  it('should return matching priority field when element id matches', () => {
    const priorityField = { id: 'test-id', reason: 'test' };
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [priorityField],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.priorityField).toEqual(priorityField);
  });

  it('should return undefined priority field when element id does not match', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'other-id', reason: 'test' }],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.priorityField).toBeUndefined();
  });

  it('should return undefined priority field when priorityFields is not provided', () => {
    vi.mocked(useDynamicForm).mockReturnValue({} as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.priorityField).toBeUndefined();
  });

  it('should return isPriorityField as true when element id matches priority field', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'test-id', reason: 'test' }],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isPriorityField).toBeTruthy();
  });

  it('should return isPriorityField as false when element id does not match priority field', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'other-id', reason: 'test' }],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isPriorityField).toBeFalsy();
  });

  it('should return isShouldDisablePriorityField as true when behavior is disableOthers and not priority field', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'other-id', reason: 'test' }],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isShouldDisablePriorityField).toBe(true);
  });

  it('should return isShouldHidePriorityField as true when behavior is hideOthers and not priority field', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'other-id', reason: 'test' }],
      priorityFieldsParams: { behavior: 'hideOthers' },
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isShouldHidePriorityField).toBeTruthy();
  });

  it('should use default behavior when priorityFieldsParams is not provided', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [{ id: 'other-id', reason: 'test' }],
    } as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isShouldDisablePriorityField).toBeTruthy();
    expect(result.current.isShouldHidePriorityField).toBeFalsy();
  });

  it('should return false for disable and hide when priorityFields is empty', () => {
    vi.mocked(useDynamicForm).mockReturnValue({
      priorityFields: [],
      priorityFieldsParams: { behavior: 'disableOthers' },
    } as unknown as ReturnType<typeof useDynamicForm>);

    const { result } = renderHook(() => usePriorityFields(mockElement));

    expect(result.current.isPriorityField).toBe(false);
    expect(result.current.isShouldDisablePriorityField).toBe(false);
    expect(result.current.isShouldHidePriorityField).toBe(false);
  });
});
