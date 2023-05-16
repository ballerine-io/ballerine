import { ApiProperty } from '@nestjs/swagger';
import { DefaultContextSchema } from '../schemas/context';
import { IsNotEmpty } from 'class-validator';

export class WorkflowRunDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  workflowId!: string;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsNotEmpty()
  context!: DefaultContextSchema;
}
