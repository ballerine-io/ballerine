import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '@/common/query-filters/sort-order';

export class WorkflowDefinitionOrderByInput {
  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  id?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  workflowDefinitionType?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  name?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  createdAt?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  updatedAt?: SortOrder;
}
