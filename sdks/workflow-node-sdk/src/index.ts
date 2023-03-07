import { createNodeWorkflow, NodeWorkflowOptions, NodeWorkflow } from "./lib/nodeWorkflow";

type TInitNodeWorkflow = (options: NodeWorkflowOptions) => NodeWorkflow;

export const initNodeWorkflow: TInitNodeWorkflow  = (options)  => {
  return createNodeWorkflow(options);
}
