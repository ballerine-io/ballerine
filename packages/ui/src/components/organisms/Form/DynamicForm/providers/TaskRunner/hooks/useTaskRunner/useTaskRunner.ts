import { useContext } from 'react';
import { TaskRunnerContext } from '../../context';

export const useTaskRunner = () => useContext(TaskRunnerContext);
