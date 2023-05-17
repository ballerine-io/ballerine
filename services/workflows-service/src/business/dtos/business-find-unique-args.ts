import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BusinessFindUniqueArgs {
  @ApiProperty({
    required: false,
    type: String,
  })
  @Type(() => String)
  filterId?: string;
}
