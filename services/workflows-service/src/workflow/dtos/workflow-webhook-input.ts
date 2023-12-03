import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowWebhookInput {
  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsString()
  payload!: object;
}
