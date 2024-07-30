import { IWorkflowDefinition } from '@/domains/workflow-definitions';

export const getStateOptions = (workflowDefinition: IWorkflowDefinition) => {
  //@ts-ignore
  return Object.keys(workflowDefinition.definition?.states || {});
};

export interface IEventDropdownOption {
  name: string;
  value: string;
  options?: IEventDropdownOption[];
}

export const getEventOptions = (
  workflowDefinition: IWorkflowDefinition,
  currentState: string,
): IEventDropdownOption[] => {
  const stateKeys = getStateOptions(workflowDefinition);

  const eventOptions: IEventDropdownOption[] = [];

  stateKeys
    .filter(key => key === currentState)
    .forEach(stateKey => {
      //@ts-ignore
      const state = workflowDefinition.definition?.states?.[stateKey]?.on || {};

      const option = {} as IEventDropdownOption;
      option.name = stateKey;
      option.value = stateKey;
      option.options = [];

      Object.keys(state).forEach(eventKey => {
        option.options!.push({
          name: eventKey,
          value: eventKey,
        });
      });

      eventOptions.push(option);
    });

  return eventOptions;
};
