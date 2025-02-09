import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useTaskRunner } from './useTaskRunner';

vi.mock('react', () => ({
  useContext: vi.fn(),
}));

vi.mock('../../context', () => ({
  TaskRunnerContext: vi.fn(),
}));

describe('useTaskRunner', () => {
  it('should return context from TaskRunnerContext', () => {
    const mockContext = {
      tasks: [],
      isRunning: false,
      addTask: vi.fn(),
      removeTask: vi.fn(),
      runTasks: vi.fn(),
    };

    vi.mocked(useContext).mockReturnValue(mockContext);

    const { result } = renderHook(() => useTaskRunner());

    expect(result.current).toBe(mockContext);
  });
});
