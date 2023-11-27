import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsObject, IsOptional, IsString } from 'class-validator';
import type { JsonValue } from 'type-fest';

export class UiDefinitionModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  workflowDefinitionId!: string;

  @ApiProperty({
    enum: ['back_office', 'collection_flow'],
    required: true,
  })
  uiContext!: string;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsOptional()
  @IsJSON()
  definition?: JsonValue | null;

  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsObject()
  uiSchema!: JsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsOptional()
  @IsJSON()
  schemaOptions?: JsonValue | null;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsOptional()
  @IsJSON()
  uiOptions?: JsonValue | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  projectId?: string | null;
}
