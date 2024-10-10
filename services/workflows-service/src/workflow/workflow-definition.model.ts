import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import type { JsonValue } from 'type-fest';

export class WorkflowDefinitionModel {
  @IsString()
  id!: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  crossEnvKey?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  reviewMachineId?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  variant?: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  version!: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  definitionType!: string;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsNotEmptyObject()
  definition!: JsonValue;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  state?: string | null;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  contextSchema?: JsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  documentsSchema?: JsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  config?: JsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsNotEmptyObject()
  @IsOptional()
  extensions?: JsonValue;

  @ApiProperty({
    required: false,
    type: 'array',
  })
  @IsArray()
  @IsOptional()
  persistStates?: JsonValue;

  @ApiProperty({
    required: false,
    type: 'array',
  })
  @IsArray()
  @IsOptional()
  submitStates?: JsonValue;

  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}
