import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDynamicForm } from '../../../context';
import { useCallbacks } from './useCallbacks';

vi.mock('../../../context');

const mockUseDynamicForm = vi.mocked(useDynamicForm);

describe('useCallbacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDynamicForm).mockReturnValue({
      callbacks: {
        onEvent: vi.fn(),
      },
    } as any);
  });

  it('should return callbacks from context', () => {
    const mockCallbacks = {
      onEvent: vi.fn(),
    };

    mockUseDynamicForm.mockReturnValue({
      callbacks: mockCallbacks,
    } as any);

    const result = useCallbacks();

    expect(result).toBe(mockCallbacks);
    expect(mockUseDynamicForm).toHaveBeenCalledTimes(1);
  });
});
