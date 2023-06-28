import { WorkflowRuntimeListItemModel } from '@/workflow/workflow-runtime-list-item.model';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class Pagination {
  @ApiProperty({ type: () => Number })
  pages!: number;

  @ApiProperty({ type: () => Number })
  total!: number;
}

export class GetWorkflowsRuntimeOutputDto {
  @ApiProperty({ type: () => WorkflowRuntimeListItemModel, isArray: true })
  @ValidateNested()
  results!: WorkflowRuntimeListItemModel[];

  @ApiProperty({ type: () => Pagination })
  meta!: Pagination;
}
