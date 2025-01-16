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

    const context = { test: 'value' };

    const mockTask1: ITask = {
      id: '1',
      element: {} as any,
      run: vi.fn().mockResolvedValue(context),
    };

    const mockTask2: ITask = {
      id: '2',
      element: {} as any,
      run: vi.fn().mockResolvedValue(context),
    };

    result.current.addTask(mockTask1);
    result.current.addTask(mockTask2);

    rerender();

    await result.current.runTasks(context);

    expect(mockTask1.run).toHaveBeenCalledWith(context);
    expect(mockTask2.run).toHaveBeenCalledWith(context);
    expect(result.current.isRunning).toBe(false);
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
