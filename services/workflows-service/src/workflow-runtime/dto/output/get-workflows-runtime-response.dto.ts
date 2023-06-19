import { WorkflowRuntimeModel } from '@/workflow-runtime/workflow-runtime.model';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class GetWorkflowsRuntimeResponseDto {
  @ApiProperty({ type: () => WorkflowRuntimeModel, isArray: true })
  @ValidateNested()
  results!: WorkflowRuntimeModel[];

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  totalItems!: number;
}
