import { AnyObject } from '@/common';
import { TUIElement } from '@ballerine/common';

export interface ITask {
  id: string;
  element: TUIElement;
  run: <TContext extends AnyObject>(context: TContext) => Promise<TContext>;
}

export interface ITaskRunnerContext {
  tasks: ITask[];
  isRunning: boolean;
  addTask: (task: ITask) => void;
  removeTask: (id: string) => void;
  runTasks: <TContext extends AnyObject>(context: TContext) => Promise<TContext>;
  getTaskById: (id: string) => ITask | undefined;
}
