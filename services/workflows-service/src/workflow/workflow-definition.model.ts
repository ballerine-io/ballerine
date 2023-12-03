import { UserModel } from '@/user/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { JsonValue } from 'type-fest';

export class WorkflowDefinitionModel {
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: () => UserModel,
  })
  @ValidateNested()
  @Type(() => UserModel)
  user?: UserModel;

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
  context?: JsonValue;

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
    type: 'object',
  })
  @IsNotEmptyObject()
  @IsOptional()
  backend?: JsonValue;

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

  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;
}
