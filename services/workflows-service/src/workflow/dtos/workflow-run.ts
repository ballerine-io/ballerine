import { ApiProperty } from '@nestjs/swagger';
import { DefaultContextSchema } from '../schemas/context';

export class WorkflowRunDto {
  @ApiProperty()
  workflowId!: string;
  @ApiProperty()
  context!: DefaultContextSchema;
}
