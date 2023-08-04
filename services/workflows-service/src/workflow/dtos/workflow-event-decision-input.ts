import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WorkflowEventDecisionInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  /**
   * The reason for the decision.
   */
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  reason?: string;
}
