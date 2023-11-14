import {StateMachine} from 'xstate';


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
  validateTransitionOnEvent({
    stateNames: Object.keys(definition.states),
    currentState: 'NULL_AS_UNINITIATED_STATE',
    targetState: definition.initial
  },);
  statesValidator(definition.states)
  if (extensions) extensionsValidator(extensions, definition.states)

};
