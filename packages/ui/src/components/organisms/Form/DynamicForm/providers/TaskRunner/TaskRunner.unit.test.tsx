import { render, renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TaskRunnerContext } from './context';
import { TaskRunner } from './TaskRunner';
import { ITask } from './types';

describe('TaskRunner', () => {
  it('should initialize with empty tasks and not running', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskRunner>{children}</TaskRunner>
    );

    const { result } = renderHook(() => useContext(TaskRunnerContext), { wrapper });

    expect(result.current.tasks).toEqual([]);
    expect(result.current.isRunning).toBe(false);
  });

  it('should add task', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskRunner>{children}</TaskRunner>
    );

    const { result, rerender } = renderHook(() => useContext(TaskRunnerContext), { wrapper });

    const mockTask: ITask = {
      id: '1',
      element: {} as any,
      run: vi.fn(),
    };

    result.current.addTask(mockTask);
    rerender();
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(mockTask);
  });

  it('should remove task', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskRunner>{children}</TaskRunner>
    );

    const { result, rerender } = renderHook(() => useContext(TaskRunnerContext), { wrapper });

    const mockTask: ITask = {
      id: '1',
      element: {} as any,
      run: vi.fn(),
    };

    result.current.addTask(mockTask);

    rerender();
    expect(result.current.tasks).toHaveLength(1);

    result.current.removeTask('1');
    rerender();
    expect(result.current.tasks).toHaveLength(0);
  });

  it('should run tasks', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskRunner>{children}</TaskRunner>
    );

    const { result, rerender } = renderHook(() => useContext(TaskRunnerContext), { wrapper });

    const mockTask1: ITask = {
      id: '1',
      element: {} as any,
      run: vi.fn().mockResolvedValue(undefined),
    };

    const mockTask2: ITask = {
      id: '2',
      element: {} as any,
      run: vi.fn().mockResolvedValue(undefined),
    };

    result.current.addTask(mockTask1);
    result.current.addTask(mockTask2);

    rerender();

    await result.current.runTasks();

    expect(mockTask1.run).toHaveBeenCalled();
    expect(mockTask2.run).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });

  it('should not run tasks if already running', async () => {
    vi.useFakeTimers();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TaskRunner>{children}</TaskRunner>
    );

    const { result, rerender } = renderHook(() => useContext(TaskRunnerContext), { wrapper });

    const mockTask: ITask = {
      id: '1',
      element: {} as any,
      run: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
    };

    result.current.addTask(mockTask);

    rerender();

    // Start first run
    const firstRun = result.current.runTasks();

    rerender();

    // Verify isRunning is true
    expect(result.current.isRunning).toBe(true);

    // Try to run again while first is still running
    const secondRun = result.current.runTasks();

    // Advance timers to resolve the promises
    vi.advanceTimersByTime(100);

    await firstRun;
    await secondRun;

    rerender();

    // Verify task only ran once and isRunning is false
    expect(mockTask.run).toHaveBeenCalledTimes(1);
    expect(result.current.isRunning).toBe(false);

    vi.useRealTimers();
  });

  it('should render children', () => {
    const { getByText } = render(
      <TaskRunner>
        <div>Test Child</div>
      </TaskRunner>,
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
