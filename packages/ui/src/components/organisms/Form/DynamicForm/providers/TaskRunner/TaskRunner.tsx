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

  const getTaskById = useCallback(
    (id: string) => {
      return tasks.find(task => task.id === id);
    },
    [tasks],
  );

  const runTasks = useCallback(
    async <TContext extends AnyObject>(context: TContext) => {
      if (isRunning) {
        return context;
      }

      setIsRunning(true);

      const tasksCompose = asyncCompose(...tasks.map(task => task.run));

      await tasksCompose(context);

      setIsRunning(false);

      setTasks([]);

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
      getTaskById,
    }),
    [tasks, isRunning, addTask, removeTask, runTasks, getTaskById],
  );

  return (
    <TaskRunnerContext.Provider value={taskRunnerContext}>{children}</TaskRunnerContext.Provider>
  );
};
