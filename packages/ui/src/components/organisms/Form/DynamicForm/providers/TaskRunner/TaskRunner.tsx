import { AnyObject } from '@/common';
import { asyncCompose } from '@/common/utils/async-compose';
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

  const runTasks = useCallback(
    async <TContext extends AnyObject>(context: TContext) => {
      if (isRunning) return context;

      setIsRunning(true);

      const tasksCompose = asyncCompose(...tasks.map(task => task.run));

      await tasksCompose(context);

      setIsRunning(false);

      return context;
    },
    [tasks, isRunning],
  );

  const taskRunnerContext = useMemo(
    () => ({
      tasks,
      isRunning,
      addTask,
      removeTask,
      runTasks,
    }),
    [tasks, isRunning, addTask, removeTask, runTasks],
  );

  return (
    <TaskRunnerContext.Provider value={taskRunnerContext}>{children}</TaskRunnerContext.Provider>
  );
};
