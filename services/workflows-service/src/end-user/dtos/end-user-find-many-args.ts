import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EndUserWhereInput } from './end-user-where-input';
import { EndUserOrderByInput } from './end-user-order-by-input';

export class EndUserFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => EndUserWhereInput,
  })
  @Type(() => EndUserWhereInput)
  where?: EndUserWhereInput;

  @ApiProperty({
    required: false,
    type: [EndUserOrderByInput],
  })
  @Type(() => EndUserOrderByInput)
  orderBy?: EndUserOrderByInput[];

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
