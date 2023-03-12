import { createNodeWorkflow, NodeWorkflowOptions, NodeWorkflow } from "./lib/node-workflow";

type TInitNodeWorkflow = (options: NodeWorkflowOptions) => NodeWorkflow;

export const initNodeWorkflow: TInitNodeWorkflow  = (options)  => {
  return createNodeWorkflow(options);
}
