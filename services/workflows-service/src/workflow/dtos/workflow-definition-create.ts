import type { InputJsonValue } from '@/types';
import { UserWhereUniqueInput } from '@/user/dtos/user-where-unique-input';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
  IsArray,
  IsObject,
} from 'class-validator';

export class WorkflowDefinitionCreateDto {
  @ApiProperty({
    required: true,
    type: () => UserWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  user!: UserWhereUniqueInput;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  reviewMachineId?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  definitionType!: string;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsNotEmptyObject()
  definition!: InputJsonValue;

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
  context?: InputJsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  extensions?: InputJsonValue;

  @ApiProperty({
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  backend?: InputJsonValue;

  @ApiProperty({
    required: false,
    type: 'array',
  })
  @IsArray()
  @IsOptional()
  persistStates?: InputJsonValue;

  @ApiProperty({
    required: false,
    type: 'array',
  })
  @IsArray()
  @IsOptional()
  submitStates?: InputJsonValue;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsOptional()
  isPublic?: boolean;
}
