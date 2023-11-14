import { StateMachine } from 'xstate';


import {WorkflowExtensions} from "../../types";
import {statesValidator, validateTransitionOnEvent} from "./states-validator";
import {extentionsValidator} from "./extentions-validator";
export const defintionValidator = (
  definition: {
    states: StateMachine<any, any, any>['states'],
    initial: string
  },
  extentions?: WorkflowExtensions,
) => {
  validateTransitionOnEvent(Object.keys(definition.states), 'NULL_AS_UNINITIATED_STATE', definition.initial);
  statesValidator(definition.states)
  extentions && extentionsValidator(extentions, definition.states)
};
