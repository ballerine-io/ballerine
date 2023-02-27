import {TCreateWorkflow} from "./types";
import {WorkflowRunner} from "./workflow-runner";

export const createWorkflow: TCreateWorkflow = ({
                                                  workflowDefinition,
                                                  workflowActions,
                                                  extensions,
                                                }) =>
  new WorkflowRunner({
    workflowDefinition,
    workflowActions,
    context: {},
    extensions,
  });
