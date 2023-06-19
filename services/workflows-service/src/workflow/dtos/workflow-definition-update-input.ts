import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { WorkflowRuntimeDataStatus } from '@prisma/client';

export class WorkflowDefinitionUpdateInput {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  context?: any;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  status?: WorkflowRuntimeDataStatus;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsString()
  @IsOptional()
  resolvedAt?: Date | null;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}
