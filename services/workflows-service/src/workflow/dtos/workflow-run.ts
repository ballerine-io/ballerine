import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { DefaultContextSchema } from '@ballerine/common';

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
}
