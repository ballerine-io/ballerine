import { WorkflowRuntimeCasesPerStatus } from '@/workflow/types';
import { ApiProperty } from '@nestjs/swagger';

export class WorkflowRuntimeCasesPerStatusModel implements WorkflowRuntimeCasesPerStatus {
  @ApiProperty()
  active!: number;

  @ApiProperty()
  completed!: number;

  @ApiProperty()
  failed!: number;
}
