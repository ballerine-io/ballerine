import { ApiProperty } from '@nestjs/swagger';
import { DefaultContextSchema } from '../schemas/context';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

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
