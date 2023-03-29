import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowEventInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  resubmissionReason?: string;
}
