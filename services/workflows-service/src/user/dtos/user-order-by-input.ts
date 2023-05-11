import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '@/common/query-filters/sort-order';

export class UserOrderByInput {
  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  id?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  email?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  password?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  roles?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  updatedAt?: SortOrder;

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  createdAt?: SortOrder;
}
