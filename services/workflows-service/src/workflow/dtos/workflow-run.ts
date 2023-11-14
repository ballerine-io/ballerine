import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import type { DefaultContextSchema } from '@ballerine/common';

export class WorkflowRunDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  workflowId!: string;

  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsNotEmpty()
  @IsObject()
  @IsOptional()
  context!: DefaultContextSchema;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceObjectName?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  salesforceRecordId?: string;
}
