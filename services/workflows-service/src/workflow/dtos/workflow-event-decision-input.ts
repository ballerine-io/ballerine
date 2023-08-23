import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  reason?: string;
}
