import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { isObject } from '@ballerine/common';

import { useTasks } from '../useTasks/useTasks';

export const useTasksDeep = (workflows: Array<TWorkflowById>) => {
  return workflows?.flatMap(workflow => {
    const { childWorkflows, ...restWorkflow } = workflow;
    let children = [];

    if (isObject(workflow) && childWorkflows) {
      children = [...children, ...useTasksDeep(childWorkflows)];
    }

    return [...useTasks(restWorkflow), ...children];
  });
};
