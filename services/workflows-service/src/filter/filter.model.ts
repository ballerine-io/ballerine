import { StringFilter } from '@/common/query-filters/string-filter';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';
import { JsonValue } from 'type-fest';

export class FilterModel {
  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  id!: string;

  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsString()
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
