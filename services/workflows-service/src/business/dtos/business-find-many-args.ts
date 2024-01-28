import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BusinessWhereInput } from './business-where-input';
import { BusinessOrderByInput } from './business-order-by-input';

export class BusinessFindManyArgs {
  @ApiProperty({
    required: false,
    type: () => BusinessWhereInput,
  })
  @Type(() => BusinessWhereInput)
  where?: BusinessWhereInput;

  @ApiProperty({
    required: false,
    type: [BusinessOrderByInput],
  })
  @Type(() => BusinessOrderByInput)
  orderBy?: BusinessOrderByInput[];

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
