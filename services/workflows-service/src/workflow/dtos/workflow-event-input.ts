import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { ResubmissionReason } from "@/workflow/workflow.service";

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
  resubmissionReason?: keyof typeof ResubmissionReason;
}
