import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { WorkflowRuntimeDataStatus } from '@prisma/client';
import type { TStateTags } from '@ballerine/common';

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
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: TStateTags;

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
