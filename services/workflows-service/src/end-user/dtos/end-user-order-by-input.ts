import { SortOrder } from '@/query-filters/sort-order';
import { ApiProperty } from '@nestjs/swagger';

export class EndUserOrderByInput {
  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  id?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  definitionType?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  name?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  createdAt?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  updatedAt?: SortOrder;
}
