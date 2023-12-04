import { StateMachine } from 'xstate';
import { WorkflowExtensions } from '../../types';
import { definitionValidator } from './definition-validator';
import {AnyRecord} from "@ballerine/common";

export const validateDefinitionLogic = (
  workflowDefinitionArgs: Record<string, any>,
  exampleContext?: AnyRecord
  ) => {
  definitionValidator(
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      states: workflowDefinitionArgs.definition.states as StateMachine<any, any, any>['states'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      initial: workflowDefinitionArgs.definition.initial as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    },
    workflowDefinitionArgs.extentions as WorkflowExtensions,
    exampleContext
  );
};
