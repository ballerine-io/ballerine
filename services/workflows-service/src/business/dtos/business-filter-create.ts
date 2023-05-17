import { ApiProperty } from '@nestjs/swagger';
import { BusinessQueryDto } from '@/business/dtos/business-filter-query';

export class BusinessFilterCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  name!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  entity!: string;

  @ApiProperty({
    required: true,
    type: () => BusinessQueryDto,
  })
  query!: BusinessQueryDto;
}
