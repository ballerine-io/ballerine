import { WorkflowRuntimeModel } from '@/workflow/workflow-runtime.model';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class Pagination {
  @ApiProperty({ type: () => Number })
  pages!: number;

  @ApiProperty({ type: () => Number })
  total!: number;
}

export class GetWorkflowsRuntimeResponseDto {
  @ApiProperty({ type: () => WorkflowRuntimeModel, isArray: true })
  @ValidateNested()
  results!: WorkflowRuntimeModel[];

  @ApiProperty({ type: () => Pagination })
  meta!: Pagination;
}
