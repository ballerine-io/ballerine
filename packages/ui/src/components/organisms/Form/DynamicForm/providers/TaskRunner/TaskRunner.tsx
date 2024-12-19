import { ReactNode, useCallback, useMemo, useState } from 'react';
import { TaskRunnerContext } from './context';
import { ITask } from './types';

interface ITaskRunnerProps {
  children: ReactNode;
}

export const TaskRunner = ({ children }: ITaskRunnerProps) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTask = useCallback((task: ITask) => {
    setTasks(prevTasks => [...prevTasks, task]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const runTasks = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    await Promise.allSettled(tasks.map(task => task.run()));
    setIsRunning(false);
  }, [tasks, isRunning]);

  const context = useMemo(
    () => ({
      tasks,
      isRunning,
      addTask,
      removeTask,
      runTasks,
    }),
    [tasks, isRunning, addTask, removeTask, runTasks],
  );

  return <TaskRunnerContext.Provider value={context}>{children}</TaskRunnerContext.Provider>;
};
