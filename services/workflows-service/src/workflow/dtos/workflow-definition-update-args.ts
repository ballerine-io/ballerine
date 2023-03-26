import { WorkflowDefinitionWhereUniqueInput } from './workflow-where-unique-input';
import { WorkflowDefinitionUpdateInput } from './workflow-definition-update-input';

export class WorkflowDefinitionUpdateArgs {
  where!: WorkflowDefinitionWhereUniqueInput;
  data!: WorkflowDefinitionUpdateInput;
}
