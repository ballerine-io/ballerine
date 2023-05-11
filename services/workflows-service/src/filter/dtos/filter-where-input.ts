import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { StringFilter } from '@/common/query-filters/string-filter';

export class FilterWhereInput {
  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @IsOptional()
  @Type(() => StringFilter)
  name?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @IsOptional()
  @Type(() => StringFilter)
  entity?: StringFilter;
}
