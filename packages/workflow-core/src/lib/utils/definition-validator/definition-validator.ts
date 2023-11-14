import { StateMachine } from 'xstate';


import {WorkflowExtensions} from "../../types";
import {statesValidator, validateTransitionOnEvent} from "./states-validator";
import {extensionsValidator} from "./extensions-validator";
export const definitionValidator = (
  definition: {
    states: StateMachine<any, any, any>['states'],
    initial: string
  },
  extensions?: WorkflowExtensions,
) => {
  validateTransitionOnEvent(Object.keys(definition.states), 'NULL_AS_UNINITIATED_STATE', definition.initial);
  statesValidator(definition.states)
  extensions && extensionsValidator(extensions, definition.states)
};
