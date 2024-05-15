import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAlertDefinitionDto {
  @ApiProperty({ example: '[Payments] - High Cumulative Amount - Inbound' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Sum of incoming transactions over a set period of time is greater than a limit',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 1 }) // Example value; replace with actual ruleSetId if applicable
  @IsNotEmpty()
  rulesetId!: number;

  @ApiProperty({ example: 1 }) // Example value; replace with actual ruleId if applicable
  @IsNotEmpty()
  ruleId!: number;

  @ApiProperty({
    example:
      '{"type": "tm_sum_transactions", "params": {"period_interval": "30 days", "transaction_type": "Deposit"}}',
    type: 'object',
  })
  @IsOptional()
  inlineRule?: Record<string, any>;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled!: boolean;

  @ApiProperty({
    example: '{"invokeOnce": true, "invokeThrottleInSeconds": 60}',
    type: 'object',
    required: false,
  })
  @IsOptional()
  dedupeStrategies?: Record<string, any>;

  @ApiProperty({ example: '{}', type: 'object', required: false })
  @IsOptional()
  config?: Record<string, any>;

  @ApiProperty({ example: ['high-risk', 'finance'], type: [String], required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: '{}', type: 'object', required: false })
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @ApiProperty({ required: true, example: 'YOUR_PROJECT_ID' }) // Replace with actual project ID
  @IsString()
  @IsNotEmpty()
  projectId!: string;
}
