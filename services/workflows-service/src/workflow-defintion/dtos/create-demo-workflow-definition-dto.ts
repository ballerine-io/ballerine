import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemoWorkflowDefinitionDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  customer!: string;

  @ApiProperty({
    required: false,
    type: [Object],
    description: 'Array of workflow overrides',
    example: [{ webPresenceReportId: 'report-123' }],
  })
  workflowOverrides?: Array<{
    webPresenceReportId?: string;
  }>;
}
