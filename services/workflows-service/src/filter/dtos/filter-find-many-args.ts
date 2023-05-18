import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FilterWhereInput } from './filter-where-input';

export class FilterFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => FilterWhereInput,
  })
  @Type(() => FilterWhereInput)
  where?: FilterWhereInput;
}
