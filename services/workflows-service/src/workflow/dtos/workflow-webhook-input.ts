import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import type { ResubmissionReason } from '@/workflow/workflow.service';

export class WorkflowWebhookInput {
  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsString()
  payload!: object;
}
