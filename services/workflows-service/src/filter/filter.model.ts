import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsObject, IsString } from 'class-validator';
import type { JsonValue } from 'type-fest';

export class FilterModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @Type(() => String)
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @Type(() => String)
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    enum: ['individuals', 'businesses'],
  })
  @IsEnum(['individuals', 'businesses'])
  entity!: string;

  @ApiProperty({
    required: true,
    type: 'object',
  })
  @IsObject()
  query!: JsonValue;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  updatedAt?: Date;
}
