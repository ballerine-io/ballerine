import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowIdWithEventInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  event!: string;
}
