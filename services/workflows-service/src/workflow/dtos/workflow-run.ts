import { ApiProperty } from '@nestjs/swagger';

export class WorkflowRunDto {
  @ApiProperty()
  workflowId!: string;
  @ApiProperty()
  context!: object;
}
