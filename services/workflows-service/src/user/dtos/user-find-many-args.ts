import { ApiProperty } from '@nestjs/swagger';
import { UserWhereInput } from './user-where-input';
import { Type } from 'class-transformer';
import { UserOrderByInput } from './user-order-by-input';

export class UserFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => UserWhereInput,
  })
  @Type(() => UserWhereInput)
  where?: UserWhereInput;

  @ApiProperty({
    required: false,
    type: [UserOrderByInput],
  })
  @Type(() => UserOrderByInput)
  orderBy?: UserOrderByInput[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @Type(() => Number)
  take?: number;
}
