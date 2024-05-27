import {
  IsArray,
  IsBoolean,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WorkflowDefinitionCreateDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false, type: String, nullable: true })
  @IsOptional()
  @IsString()
  crossEnvKey?: string | null;

  @ApiProperty({ required: false, type: String, nullable: true })
  @IsOptional()
  @IsString()
  displayName?: string | null;

  @ApiProperty({ required: false, type: String, nullable: true })
  @IsOptional()
  @IsString()
  reviewMachineId?: string | null;

  @ApiProperty({ required: true, type: String })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  version?: number;

  @ApiProperty({ required: false, type: String, nullable: true })
  @IsOptional()
  @IsString()
  projectId?: string | null;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: true, type: String })
  @IsString()
  definitionType!: string;

  @ApiProperty({ required: true, type: Object })
  @IsNotEmptyObject()
  @IsObject()
  definition!: Record<string, unknown>;

  @ApiProperty({ required: false, type: Object, nullable: true })
  @IsOptional()
  @IsObject()
  contextSchema?: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: Object, nullable: true })
  @IsOptional()
  @IsObject()
  documentsSchema?: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: Object, nullable: true })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: Array, nullable: true })
  @IsOptional()
  @IsArray()
  supportedPlatforms?: unknown[] | null;

  @ApiProperty({ required: false, type: Object, nullable: true })
  @IsOptional()
  @IsObject()
  extensions?: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  variant?: string;

  @ApiProperty({ required: false, type: Object, nullable: true })
  @IsOptional()
  @IsObject()
  backend?: Record<string, unknown> | null;

  @ApiProperty({ required: false, type: Array, nullable: true })
  @IsOptional()
  @IsArray()
  persistStates?: unknown[] | null;

  @ApiProperty({ required: false, type: Array, nullable: true })
  @IsOptional()
  @IsArray()
  submitStates?: unknown[] | null;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
