import { ApiProperty } from '@nestjs/swagger';
import { WorkflowDefinitionWhereInput } from './workflow-definition-where-input';
import { Type } from 'class-transformer';
import { WorkflowDefinitionOrderByInput } from './workflow-definition-order-by-input';

export class WorkflowDefinitionFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => WorkflowDefinitionWhereInput,
  })
  @Type(() => WorkflowDefinitionWhereInput)
  where?: WorkflowDefinitionWhereInput;

  @ApiProperty({
    required: false,
    type: [WorkflowDefinitionOrderByInput],
  })
  @Type(() => WorkflowDefinitionOrderByInput)
  orderBy?: WorkflowDefinitionOrderByInput[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Number)
  take?: number;
}
