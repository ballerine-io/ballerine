import { IFormElement } from '../../../types';

export interface ITask {
  id: string;
  element: IFormElement;
  run: () => Promise<void>;
}

export interface ITaskRunnerContext {
  tasks: ITask[];
  isRunning: boolean;
  addTask: (task: ITask) => void;
  removeTask: (id: string) => void;
  runTasks: () => Promise<void>;
}
