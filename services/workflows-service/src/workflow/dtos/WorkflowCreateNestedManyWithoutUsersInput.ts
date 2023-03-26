import { WorkflowDefinitionWhereUniqueInput } from './workflow-where-unique-input';
import { ApiProperty } from '@nestjs/swagger';

export class WorkflowCreateNestedManyWithoutUsersInput {
  @ApiProperty({
    required: false,
    type: () => [WorkflowDefinitionWhereUniqueInput],
  })
  connect?: Array<WorkflowDefinitionWhereUniqueInput>;
}
