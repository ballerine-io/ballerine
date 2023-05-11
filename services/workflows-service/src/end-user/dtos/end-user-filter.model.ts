import { ApiProperty } from '@nestjs/swagger';
import { StringFilter } from '@/common/query-filters/string-filter';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { EndUserQueryDto } from '@/end-user/dtos/end-user-filter-query';

export class EndUserFilterModel {
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
    type: () => EndUserQueryDto,
  })
  @Type(() => EndUserQueryDto)
  query!: EndUserQueryDto;

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
