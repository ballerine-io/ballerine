import { StateMachine } from 'xstate';
import {WorkflowExtensions} from "../../types";
import {defintionValidator} from "./defintion-validator";
export const validateDefinitionLogic = (workflowDefinitionArgs: Record<string, any>) => {
  defintionValidator(
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      states: workflowDefinitionArgs.definition.states as StateMachine<any, any, any>['states'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      initial: workflowDefinitionArgs.definition.initial as string
    },
    workflowDefinitionArgs.extentions as WorkflowExtensions
  )
}
