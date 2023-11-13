import { StateMachine } from 'xstate';


import {WorkflowExtensions} from "../../types";
import {statesValidator, validateTransitionOnEvent} from "./states-validator";
import {extentionsValidator} from "./extentions-validator";
export const defintionValidator = (
  defintion: {
    id: string,
    states: StateMachine<any, any, any>['states'],
    initial: string,
    context: any
  },
  extentions: WorkflowExtensions,
) => {
  validateTransitionOnEvent(Object.keys(defintion.states), 'NULL_AS_UNINITIALED_STATE', defintion.initial);
  statesValidator(defintion.states)
  extentionsValidator(extentions, defintion.states)
};
